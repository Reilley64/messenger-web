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

import { mapValues } from '../runtime';
import type { MessageWithGroupResponseDtoGroup } from './MessageWithGroupResponseDtoGroup';
import {
    MessageWithGroupResponseDtoGroupFromJSON,
    MessageWithGroupResponseDtoGroupFromJSONTyped,
    MessageWithGroupResponseDtoGroupToJSON,
} from './MessageWithGroupResponseDtoGroup';
import type { GroupResponseDtoUsersInner } from './GroupResponseDtoUsersInner';
import {
    GroupResponseDtoUsersInnerFromJSON,
    GroupResponseDtoUsersInnerFromJSONTyped,
    GroupResponseDtoUsersInnerToJSON,
} from './GroupResponseDtoUsersInner';

/**
 * 
 * @export
 * @interface MessageWithGroupResponseDto
 */
export interface MessageWithGroupResponseDto {
    /**
     * 
     * @type {string}
     * @memberof MessageWithGroupResponseDto
     */
    content: string;
    /**
     * 
     * @type {Date}
     * @memberof MessageWithGroupResponseDto
     */
    createdAt: Date;
    /**
     * 
     * @type {MessageWithGroupResponseDtoGroup}
     * @memberof MessageWithGroupResponseDto
     */
    group: MessageWithGroupResponseDtoGroup;
    /**
     * 
     * @type {string}
     * @memberof MessageWithGroupResponseDto
     */
    id: string;
    /**
     * 
     * @type {GroupResponseDtoUsersInner}
     * @memberof MessageWithGroupResponseDto
     */
    source: GroupResponseDtoUsersInner;
    /**
     * 
     * @type {Date}
     * @memberof MessageWithGroupResponseDto
     */
    updatedAt: Date;
}

/**
 * Check if a given object implements the MessageWithGroupResponseDto interface.
 */
export function instanceOfMessageWithGroupResponseDto(value: object): value is MessageWithGroupResponseDto {
    if (!('content' in value) || value['content'] === undefined) return false;
    if (!('createdAt' in value) || value['createdAt'] === undefined) return false;
    if (!('group' in value) || value['group'] === undefined) return false;
    if (!('id' in value) || value['id'] === undefined) return false;
    if (!('source' in value) || value['source'] === undefined) return false;
    if (!('updatedAt' in value) || value['updatedAt'] === undefined) return false;
    return true;
}

export function MessageWithGroupResponseDtoFromJSON(json: any): MessageWithGroupResponseDto {
    return MessageWithGroupResponseDtoFromJSONTyped(json, false);
}

export function MessageWithGroupResponseDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): MessageWithGroupResponseDto {
    if (json == null) {
        return json;
    }
    return {
        
        'content': json['content'],
        'createdAt': (new Date(json['createdAt'])),
        'group': MessageWithGroupResponseDtoGroupFromJSON(json['group']),
        'id': json['id'],
        'source': GroupResponseDtoUsersInnerFromJSON(json['source']),
        'updatedAt': (new Date(json['updatedAt'])),
    };
}

export function MessageWithGroupResponseDtoToJSON(value?: MessageWithGroupResponseDto | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'content': value['content'],
        'createdAt': ((value['createdAt']).toISOString()),
        'group': MessageWithGroupResponseDtoGroupToJSON(value['group']),
        'id': value['id'],
        'source': GroupResponseDtoUsersInnerToJSON(value['source']),
        'updatedAt': ((value['updatedAt']).toISOString()),
    };
}

