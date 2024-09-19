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
  UserRequestDto,
  UserResponseDto,
} from '../models/index';
import {
    UserRequestDtoFromJSON,
    UserRequestDtoToJSON,
    UserResponseDtoFromJSON,
    UserResponseDtoToJSON,
} from '../models/index';

export interface CreateUserRequest {
    userRequestDto: UserRequestDto;
}

export interface GetUserRequest {
    userId: string;
}

/**
 * 
 */
export class UserRestControllerApi extends runtime.BaseAPI {

    /**
     */
    async createUserRaw(requestParameters: CreateUserRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<UserResponseDto>> {
        if (requestParameters['userRequestDto'] == null) {
            throw new runtime.RequiredError(
                'userRequestDto',
                'Required parameter "userRequestDto" was null or undefined when calling createUser().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("bearer_auth", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/v1/users/`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: UserRequestDtoToJSON(requestParameters['userRequestDto']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UserResponseDtoFromJSON(jsonValue));
    }

    /**
     */
    async createUser(requestParameters: CreateUserRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<UserResponseDto> {
        const response = await this.createUserRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async getUserRaw(requestParameters: GetUserRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<UserResponseDto>> {
        if (requestParameters['userId'] == null) {
            throw new runtime.RequiredError(
                'userId',
                'Required parameter "userId" was null or undefined when calling getUser().'
            );
        }

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
            path: `/v1/users/{user_id}`.replace(`{${"user_id"}}`, encodeURIComponent(String(requestParameters['userId']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => UserResponseDtoFromJSON(jsonValue));
    }

    /**
     */
    async getUser(requestParameters: GetUserRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<UserResponseDto> {
        const response = await this.getUserRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
