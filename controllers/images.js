import path from 'path';
import sizeOf from 'image-size';
import Sharp from 'sharp';
import * as paginate from 'koa-ctx-paginate';
import Image from '../models/images';
import getNewFilePath from '../utils/getNewFilePath';

class ImageController {
  /* eslint-disable no-param-reassign*/

  /**
   * Get all images
   * @param {ctx} Koa Context
   */
  static async find(ctx) {
    const [results, itemCount] = await Promise.all([
      Image.find({})
        .limit(ctx.query.limit)
        .skip(ctx.paginate.skip)
        .lean()
        .exec(),
      Image.count({}),
    ]);
    const pageCount = Math.ceil(itemCount / ctx.query.limit);
    ctx.body = {
      object: 'list',
      has_more: paginate.hasNextPages(ctx)(pageCount),
      pagination: paginate.getArrayPages(ctx)(3, pageCount, ctx.query.page),
      data: results,
    };
  }

  /**
   * Find an image
   * @param {ctx} Koa Context
   */
  static async findById(ctx) {
    const image = await Image.findOne({ id: ctx.params.id });
    if (!image) {
      ctx.throw(404);
    }
    ctx.body = image;
  }

  /**
   * Add an image
   * @param {ctx} Koa Context
   */
  static async add(ctx) {
    const image = ctx.request.body.files.image;
    const fileName = path.basename(image.path);
    const dimensions = sizeOf(image.path);
    const imageData = {
      name: fileName,
      url: `/uploads/${fileName}`,
      width: dimensions.width,
      height: dimensions.height,
    };
    ctx.body = await new Image(imageData).save();
  }

  /**
   * Delete a image
   * @param {ctx} Koa Context
   */
  static async delete(ctx) {
    const image = await Image.findOne({ id: ctx.params.id }).remove();
    if (!image) {
      ctx.throw(404);
    }
    ctx.body = image;
  }

  /**
   * Resize an image
   * @param {ctx} Koa Context
   */
  static async resize(ctx) {
    const image = await Image.findOne({ id: ctx.params.id });
    if (!image) {
      ctx.throw(404);
    }

    const qry = ctx.request.query;
    if (!('width' in qry)) {
      ctx.throw(422, 'width parameter is required');
    }

    if (!('height' in qry)) {
      ctx.throw(422, 'height parameter is required');
    }

    const width = parseInt(qry.height, 10);
    const height = parseInt(qry.height, 10);
    const params = `${width}x${height}`;

    // Check to see if the rendition already exists
    const rendition = image.renditions.filter(elem => elem.params === params);
    if (rendition.length) {
      ctx.body = rendition;
    } else {
      // Create a new rendition and save it
      const img = path.join(__dirname, '../public/uploads/', image.name);
      const newFilePath = getNewFilePath(img, params);
      const info = await Sharp(img)
        .resize(width, height)
        .toFile(newFilePath);

      const newRendition = {
        params,
        name: newFilePath,
        url: newFilePath,
        width: info.width,
        height: info.height,
      };
      image.renditions.push(newRendition);
      await image.save();
      ctx.body = newRendition;
    }
  }

  /**
   * Rotate an image
   * @param {ctx} Koa Context
   */
  static async rotate(ctx) {
    const image = await Image.findOne({ id: ctx.params.id });
    if (!image) {
      ctx.throw(404);
    }
    const qry = ctx.request.query;
    if (!('angle' in qry)) {
      ctx.throw(422, 'angle parameter is required');
    }

    // Check to see if the rendition already exists
    const angle = parseInt(qry.angle, 10);
    if (angle % 90 !== 0) {
      ctx.throw(422, 'angle must be a multiple of 90');
    }

    const params = `r${angle}`;
    const rendition = image.renditions.filter(elem => elem.params === params);
    if (rendition.length) {
      ctx.body = rendition;
    } else {
      // Create a new rendition and save it
      const img = path.join(__dirname, '../public/uploads/', image.name);
      const newFilePath = getNewFilePath(img, params);
      const info = await Sharp(img)
        .rotate(angle)
        .toFile(newFilePath);

      const newRendition = {
        params,
        name: newFilePath,
        url: newFilePath,
        width: info.width,
        height: info.height,
      };
      image.renditions.push(newRendition);
      await image.save();
      ctx.body = newRendition;
    }
  }
  /* eslint-enable no-param-reassign */
}

export default ImageController;
