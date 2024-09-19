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

import { mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface UserResponseDto
 */
export interface UserResponseDto {
    /**
     * 
     * @type {string}
     * @memberof UserResponseDto
     */
    createdAt: string;
    /**
     * 
     * @type {string}
     * @memberof UserResponseDto
     */
    id: string;
    /**
     * 
     * @type {string}
     * @memberof UserResponseDto
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof UserResponseDto
     */
    publicKey: string;
    /**
     * 
     * @type {string}
     * @memberof UserResponseDto
     */
    updatedAt: string;
}

/**
 * Check if a given object implements the UserResponseDto interface.
 */
export function instanceOfUserResponseDto(value: object): value is UserResponseDto {
    if (!('createdAt' in value) || value['createdAt'] === undefined) return false;
    if (!('id' in value) || value['id'] === undefined) return false;
    if (!('name' in value) || value['name'] === undefined) return false;
    if (!('publicKey' in value) || value['publicKey'] === undefined) return false;
    if (!('updatedAt' in value) || value['updatedAt'] === undefined) return false;
    return true;
}

export function UserResponseDtoFromJSON(json: any): UserResponseDto {
    return UserResponseDtoFromJSONTyped(json, false);
}

export function UserResponseDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): UserResponseDto {
    if (json == null) {
        return json;
    }
    return {
        
        'createdAt': json['createdAt'],
        'id': json['id'],
        'name': json['name'],
        'publicKey': json['publicKey'],
        'updatedAt': json['updatedAt'],
    };
}

export function UserResponseDtoToJSON(value?: UserResponseDto | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'createdAt': value['createdAt'],
        'id': value['id'],
        'name': value['name'],
        'publicKey': value['publicKey'],
        'updatedAt': value['updatedAt'],
    };
}

