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
import type { GroupResponseDtoUsersInner } from './GroupResponseDtoUsersInner';
import {
    GroupResponseDtoUsersInnerFromJSON,
    GroupResponseDtoUsersInnerFromJSONTyped,
    GroupResponseDtoUsersInnerToJSON,
} from './GroupResponseDtoUsersInner';

/**
 * 
 * @export
 * @interface GroupResponseDto
 */
export interface GroupResponseDto {
    /**
     * 
     * @type {Date}
     * @memberof GroupResponseDto
     */
    createdAt: Date;
    /**
     * 
     * @type {string}
     * @memberof GroupResponseDto
     */
    id: string;
    /**
     * 
     * @type {number}
     * @memberof GroupResponseDto
     */
    messageRequestId?: number;
    /**
     * 
     * @type {string}
     * @memberof GroupResponseDto
     */
    name: string;
    /**
     * 
     * @type {Date}
     * @memberof GroupResponseDto
     */
    updatedAt: Date;
    /**
     * 
     * @type {Array<GroupResponseDtoUsersInner>}
     * @memberof GroupResponseDto
     */
    users: Array<GroupResponseDtoUsersInner>;
}

/**
 * Check if a given object implements the GroupResponseDto interface.
 */
export function instanceOfGroupResponseDto(value: object): value is GroupResponseDto {
    if (!('createdAt' in value) || value['createdAt'] === undefined) return false;
    if (!('id' in value) || value['id'] === undefined) return false;
    if (!('name' in value) || value['name'] === undefined) return false;
    if (!('updatedAt' in value) || value['updatedAt'] === undefined) return false;
    if (!('users' in value) || value['users'] === undefined) return false;
    return true;
}

export function GroupResponseDtoFromJSON(json: any): GroupResponseDto {
    return GroupResponseDtoFromJSONTyped(json, false);
}

export function GroupResponseDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): GroupResponseDto {
    if (json == null) {
        return json;
    }
    return {
        
        'createdAt': (new Date(json['createdAt'])),
        'id': json['id'],
        'messageRequestId': json['messageRequestId'] == null ? undefined : json['messageRequestId'],
        'name': json['name'],
        'updatedAt': (new Date(json['updatedAt'])),
        'users': ((json['users'] as Array<any>).map(GroupResponseDtoUsersInnerFromJSON)),
    };
}

export function GroupResponseDtoToJSON(value?: GroupResponseDto | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'createdAt': ((value['createdAt']).toISOString()),
        'id': value['id'],
        'messageRequestId': value['messageRequestId'],
        'name': value['name'],
        'updatedAt': ((value['updatedAt']).toISOString()),
        'users': ((value['users'] as Array<any>).map(GroupResponseDtoUsersInnerToJSON)),
    };
}

