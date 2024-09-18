/* tslint:disable */
/* eslint-disable */
/**
 * 
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import type {
  MessageWithGroupResponseDto,
} from '../models/index';
import {
    MessageWithGroupResponseDtoFromJSON,
    MessageWithGroupResponseDtoToJSON,
} from '../models/index';

/**
 * 
 */
export class MessageRestControllerApi extends runtime.BaseAPI {

    /**
     */
    async getMessagesRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<MessageWithGroupResponseDto>>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["Authorization"] = await this.configuration.apiKey("Authorization"); // apiKey authentication
        }

        const response = await this.request({
            path: `/v1/messages`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(MessageWithGroupResponseDtoFromJSON));
    }

    /**
     */
    async getMessages(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<MessageWithGroupResponseDto>> {
        const response = await this.getMessagesRaw(initOverrides);
        return await response.value();
    }

}
