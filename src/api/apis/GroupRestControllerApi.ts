/* tslint:disable */
/* eslint-disable */
/**
 * OpenAPI definition
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: v0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import type {
  Group,
  MessageRequestDto,
  MessageResponseDto,
  PagedModelMessageResponseDto,
} from '../models/index';
import {
    GroupFromJSON,
    GroupToJSON,
    MessageRequestDtoFromJSON,
    MessageRequestDtoToJSON,
    MessageResponseDtoFromJSON,
    MessageResponseDtoToJSON,
    PagedModelMessageResponseDtoFromJSON,
    PagedModelMessageResponseDtoToJSON,
} from '../models/index';

export interface CreateMessageRequest {
    groupId: string;
    messageRequestDto: MessageRequestDto;
}

export interface GetGroupRequest {
    groupId: string;
}

export interface GetMessagesRequest {
    groupId: string;
    page?: number;
    size?: number;
    sort?: Array<string>;
}

/**
 * 
 */
export class GroupRestControllerApi extends runtime.BaseAPI {

    /**
     */
    async createMessageRaw(requestParameters: CreateMessageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<MessageResponseDto>> {
        if (requestParameters['groupId'] == null) {
            throw new runtime.RequiredError(
                'groupId',
                'Required parameter "groupId" was null or undefined when calling createMessage().'
            );
        }

        if (requestParameters['messageRequestDto'] == null) {
            throw new runtime.RequiredError(
                'messageRequestDto',
                'Required parameter "messageRequestDto" was null or undefined when calling createMessage().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/groups/{groupId}/messages`.replace(`{${"groupId"}}`, encodeURIComponent(String(requestParameters['groupId']))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: MessageRequestDtoToJSON(requestParameters['messageRequestDto']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => MessageResponseDtoFromJSON(jsonValue));
    }

    /**
     */
    async createMessage(requestParameters: CreateMessageRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<MessageResponseDto> {
        const response = await this.createMessageRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async getGroupRaw(requestParameters: GetGroupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Group>> {
        if (requestParameters['groupId'] == null) {
            throw new runtime.RequiredError(
                'groupId',
                'Required parameter "groupId" was null or undefined when calling getGroup().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/groups/{groupId}`.replace(`{${"groupId"}}`, encodeURIComponent(String(requestParameters['groupId']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => GroupFromJSON(jsonValue));
    }

    /**
     */
    async getGroup(requestParameters: GetGroupRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Group> {
        const response = await this.getGroupRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async getMessagesRaw(requestParameters: GetMessagesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PagedModelMessageResponseDto>> {
        if (requestParameters['groupId'] == null) {
            throw new runtime.RequiredError(
                'groupId',
                'Required parameter "groupId" was null or undefined when calling getMessages().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['page'] != null) {
            queryParameters['page'] = requestParameters['page'];
        }

        if (requestParameters['size'] != null) {
            queryParameters['size'] = requestParameters['size'];
        }

        if (requestParameters['sort'] != null) {
            queryParameters['sort'] = requestParameters['sort'];
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = await token("Bearer", []);

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/groups/{groupId}/messages`.replace(`{${"groupId"}}`, encodeURIComponent(String(requestParameters['groupId']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PagedModelMessageResponseDtoFromJSON(jsonValue));
    }

    /**
     */
    async getMessages(requestParameters: GetMessagesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PagedModelMessageResponseDto> {
        const response = await this.getMessagesRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
