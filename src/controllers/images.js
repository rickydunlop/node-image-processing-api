import path from 'path';
import sizeOf from 'image-size';
import Sharp from 'sharp';
import * as paginate from 'koa-ctx-paginate';
import Image from '../models/images';
import getNewFileNameAndPath from '../utils/getNewFileNameAndPath';
import { BASE_URL } from '../config';

class ImageController {
  /* eslint-disable no-param-reassign*/

  /**
   * Get all images
   * @param {ctx} Koa Context
   */
  static async find(ctx) {
    const [results, itemCount] = await Promise.all([
      Image.find({}, 'id name url width height renditions')
        .limit(ctx.query.limit)
        .skip(ctx.paginate.skip)
        .lean()
        .exec(),
      Image.estimatedDocumentCount(),
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
    const image = ctx.request.files.image;
    const fileName = path.basename(image.path);
    const dimensions = sizeOf(image.path);
    const imageData = {
      name: fileName,
      url: `${BASE_URL}/uploads/${fileName}`,
      width: dimensions.width,
      height: dimensions.height,
    };
    const res = await new Image(imageData).save();
    ctx.body = {
      id: res.id,
      name: res.name,
      url: res.url,
      width: res.width,
      height: res.height,
    };
  }

  /**
   * Delete a image
   * @param {ctx} Koa Context
   */
  static async delete(ctx) {
    const image = await Image.deleteOne({ id: ctx.params.id });
    if (!image) {
      ctx.throw(404);
    }
    ctx.status = 200;
    ctx.body = 'Image deleted';
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
      const { newFileName, newFilePath } = getNewFileNameAndPath(img, params);
      const info = await Sharp(img)
        .resize(width, height)
        .toFile(newFilePath);

      const newRendition = {
        params,
        name: newFileName,
        url: `${BASE_URL}/uploads/${newFileName}`,
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
      const { newFileName, newFilePath } = getNewFileNameAndPath(img, params);
      const info = await Sharp(img)
        .rotate(angle)
        .toFile(newFilePath);

      const newRendition = {
        params,
        name: newFileName,
        url: `${BASE_URL}/uploads/${newFileName}`,
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
