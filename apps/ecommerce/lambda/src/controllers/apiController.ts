import { NextFunction, Request, Response } from 'express';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { ExternalResource, ExternalResourceLink } from '@/src/types';
import { config } from '../config';
const BASE_URL = `${config.baseUrl}${config.stage === 'prod' ? '' : `/${config.stage}`}`;

const PROVIDERS: Record<string, string> = {
  shopify: `${BASE_URL}/shopify/resource`,
  magento: `${BASE_URL}/magento/resource`,
};

const ApiController = {
  ping: (req: Request, res: Response) => {
    return res.send({ status: 'ok', message: 'pong' });
  },

  resource: async (
    req: Request,
    res: Response<ExternalResource | { error?: unknown; message: string }>,
    next: NextFunction
  ) => {
    try {
      const resourceLink: ExternalResourceLink = req.body;
      const resourceProvider = resourceLink.sys.linkType?.split(':')[0];
      const proxyUrl = PROVIDERS[resourceProvider?.toLowerCase()];

      if (!proxyUrl) {
        return res.status(404).send({
          status: 'error',
          message: `Provider${resourceProvider ? `: ${resourceProvider}` : ''} not found`,
        });
      }

      try {
        let response;
        try {
          response = await axios.post(proxyUrl, resourceLink);
        } catch (error) {
          response = (error as AxiosError).response;
        } finally {
          res
            .status((response as AxiosResponse).status)
            .send(JSON.parse(JSON.stringify((response as AxiosResponse).data)));
        }
      } catch (error) {
        console.log('error', error);
        res.status(500).send({
          status: 'error',
          message: 'Error fetching resource',
        });
      }
    } catch (error) {
      next(error);
    }
  },
};

export default ApiController;
