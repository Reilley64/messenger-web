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
/**
 * 
 * @export
 * @interface UserRequestDto
 */
export interface UserRequestDto {
    /**
     * 
     * @type {string}
     * @memberof UserRequestDto
     */
    publicKey: string;
}

/**
 * Check if a given object implements the UserRequestDto interface.
 */
export function instanceOfUserRequestDto(value: object): value is UserRequestDto {
    if (!('publicKey' in value) || value['publicKey'] === undefined) return false;
    return true;
}

export function UserRequestDtoFromJSON(json: any): UserRequestDto {
    return UserRequestDtoFromJSONTyped(json, false);
}

export function UserRequestDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): UserRequestDto {
    if (json == null) {
        return json;
    }
    return {
        
        'publicKey': json['publicKey'],
    };
}

export function UserRequestDtoToJSON(value?: UserRequestDto | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'publicKey': value['publicKey'],
    };
}

