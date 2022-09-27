import { AppDataSource } from "../data-source";
import { Request, Response, NextFunction } from "express";
import trycatch from "../util/trycatch";
import { App } from "../entity/App";

export default class AppsController {
  private appsRepository = AppDataSource.getRepository(App);

  async save(request: Request, response: Response, next: NextFunction) {
    const slug = request?.body?.name?.split(" ")?.join("_");
    const [data, error] = await trycatch(
      this.appsRepository.save({ ...request.body, slug })
    );
    if (error) {
      response.status(404);
      return {
        msg: "An error occured",
        desc: error,
      };
    }
    return data;
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const id = request?.params?.id;
    const [data, error] = await trycatch(
      this.appsRepository.find({ where: { id } })
    );
    if (error) {
      response.status(404);
      return {
        msg: "An error occured",
        desc: error,
      };
    }
    return data[0];
  }

  async bySlug(request: Request, response: Response, next: NextFunction) {
    const slug = request?.params?.slug;
    const [data, error] = await trycatch(
      this.appsRepository.find({ where: { slug } })
    );
    if (error) {
      response.status(404);
      return {
        msg: "An error occured",
        desc: error,
      };
    }
    return data[0];
  }

  async owner(request: Request, response: Response, next: NextFunction) {
    const id = request?.params?.id;
    const [data, error] = await trycatch(
      this.appsRepository.find({ where: { owner: id } })
    );
    if (error) {
      response.status(404);
      return {
        msg: "An error occured",
        desc: error,
      };
    }
    return data;
  }

  async all(request: Request, response: Response, next: NextFunction) {
    const [data, error] = await trycatch(
      this.appsRepository.find({ where: { isDeactivated: false } })
    );
    if (error) {
      response.status(404);
      return {
        msg: "An error occured",
        desc: error,
      };
    }
    return data;
  }
}
