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

import { mapValues } from '../runtime';
import type { PageMetadata } from './PageMetadata';
import {
    PageMetadataFromJSON,
    PageMetadataFromJSONTyped,
    PageMetadataToJSON,
} from './PageMetadata';
import type { MessageResponseDto } from './MessageResponseDto';
import {
    MessageResponseDtoFromJSON,
    MessageResponseDtoFromJSONTyped,
    MessageResponseDtoToJSON,
} from './MessageResponseDto';

/**
 * 
 * @export
 * @interface PagedModelMessageResponseDto
 */
export interface PagedModelMessageResponseDto {
    /**
     * 
     * @type {Array<MessageResponseDto>}
     * @memberof PagedModelMessageResponseDto
     */
    content?: Array<MessageResponseDto>;
    /**
     * 
     * @type {PageMetadata}
     * @memberof PagedModelMessageResponseDto
     */
    page?: PageMetadata;
}

/**
 * Check if a given object implements the PagedModelMessageResponseDto interface.
 */
export function instanceOfPagedModelMessageResponseDto(value: object): value is PagedModelMessageResponseDto {
    return true;
}

export function PagedModelMessageResponseDtoFromJSON(json: any): PagedModelMessageResponseDto {
    return PagedModelMessageResponseDtoFromJSONTyped(json, false);
}

export function PagedModelMessageResponseDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): PagedModelMessageResponseDto {
    if (json == null) {
        return json;
    }
    return {
        
        'content': json['content'] == null ? undefined : ((json['content'] as Array<any>).map(MessageResponseDtoFromJSON)),
        'page': json['page'] == null ? undefined : PageMetadataFromJSON(json['page']),
    };
}

export function PagedModelMessageResponseDtoToJSON(value?: PagedModelMessageResponseDto | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'content': value['content'] == null ? undefined : ((value['content'] as Array<any>).map(MessageResponseDtoToJSON)),
        'page': PageMetadataToJSON(value['page']),
    };
}

