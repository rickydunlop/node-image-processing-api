import path from 'path';
import sizeOf from 'image-size';
import Sharp from 'sharp';
import Image from '../models/images';
import getNewFilePath from '../utils/getNewFilePath';

class ImageController {
  /* eslint-disable no-param-reassign*/

  /**
   * Get all images
   * @param {ctx} Koa Context
   */
  static async find(ctx) {
    ctx.body = await Image.find();
  }

  /**
   * Find an image
   * @param {ctx} Koa Context
   */
  static async findById(ctx) {
    try {
      const image = await Image.findById(ctx.params.id);
      if (!image) {
        ctx.throw(404);
      }
      ctx.body = image;
    } catch (err) {
      if (err.name === 'CastError' || err.name === 'NotFoundError') {
        ctx.throw(404);
      }
      ctx.throw(500);
    }
  }

  /**
   * Add an image
   * @param {ctx} Koa Context
   */
  static async add(ctx) {
    try {
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
    } catch (err) {
      console.log(err);
      ctx.throw(500);
    }
  }

  /**
   * Delete a image
   * @param {ctx} Koa Context
   */
  static async delete(ctx) {
    try {
      const image = await Image.findByIdAndRemove(ctx.params.id);
      if (!image) {
        ctx.throw(404);
      }
      ctx.body = image;
    } catch (err) {
      if (err.name === 'CastError' || err.name === 'NotFoundError') {
        ctx.throw(404);
      }
      ctx.throw(500);
    }
  }

  /**
   * Resize an image
   * @param {ctx} Koa Context
   */
  static async resize(ctx) {
    try {
      const image = await Image.findById(ctx.params.id);
      if (!image) {
        ctx.throw(404);
      }
      // Check to see if the rendition already exists
      const width = parseInt(ctx.params.width, 10);
      const height = parseInt(ctx.params.height, 10);
      const params = `${width}x${height}`;
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
    } catch (err) {
      console.log(err);
      if (err.name === 'CastError' || err.name === 'NotFoundError') {
        ctx.throw(404);
      }
      ctx.throw(500);
    }
  }

  /**
   * Rotate an image
   * @param {ctx} Koa Context
   */
  static async rotate(ctx) {
    try {
      const image = await Image.findById(ctx.params.id);
      if (!image) {
        ctx.throw(404);
      }
      // Check to see if the rendition already exists
      const angle = parseInt(ctx.params.angle, 10);
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
    } catch (err) {
      console.log(err);
      if (err.name === 'CastError' || err.name === 'NotFoundError') {
        ctx.throw(404);
      }
      ctx.throw(500);
    }
  }
  /* eslint-enable no-param-reassign */
}

export default ImageController;
