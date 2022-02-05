import dotenv from 'dotenv'; dotenv.config()

import chai from 'chai'
import chaiHttp from 'chai-http'
import faker from 'faker'
import server from '../main/index'
import mongoose from 'mongoose'
import {keys} from '../main/config/keys'
import request from 'supertest'
import fraudServices from '../app/fraudAnalyzer/fraud.services';


let should = chai.should()
let expect = chai.expect
let assert = chai.assert

chai.use(chaiHttp)

describe('Fraud API Test for', () => {


});

test('Fraud API Test for', () => {

    const answer = 100
    expect(answer).to.equal(100)
    done()
})