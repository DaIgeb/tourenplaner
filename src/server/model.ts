import * as express from 'express';
export interface MyRequestObject extends express.Request{
    db: any;
}