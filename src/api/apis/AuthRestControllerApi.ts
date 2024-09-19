/* tslint:disable */
/* eslint-disable */
/**
 * Messenger API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import type {
  UserResponseDto,
} from '../models/index';
import {
    UserResponseDtoFromJSON,
    UserResponseDtoToJSON,
} from '../models/index';

/**
 * 
 */
export class AuthRestControllerApi extends runtime.BaseAPI {

    /**
     */
    async getAuthUserRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<UserResponseDto>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("bearer_auth", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/v1/user/`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UserResponseDtoFromJSON(jsonValue));
    }

    /**
     */
    async getAuthUser(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<UserResponseDto> {
        const response = await this.getAuthUserRaw(initOverrides);
        return await response.value();
    }

}
