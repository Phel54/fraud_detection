import chai from 'chai'
import chaiHttp from 'chai-http'
import faker from 'faker'
import server from '../main/index'

// Assertion Style
let should = chai.should()
let expect = chai.expect

chai.use(chaiHttp)

describe('All Test', () => {
  it('It should return 100', done => {
    const answer = 100
    expect(answer).to.equal(100)
    done()
  })
})  