const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function () {
  let testProject = 'test_project';
  let testIssueId;

  test('Create an issue with every field', function (done) {
    chai.request(server)
      .post(`/api/issues/${testProject}`)
      .send({
        issue_title: "Test Title",
        issue_text: "Test Text",
        created_by: "Tester",
        assigned_to: "Dev",
        status_text: "In Progress"
      })
      .end((err, res) => {
        assert.isObject(res.body);
        assert.property(res.body, '_id');
        assert.propertyVal(res.body, 'issue_title', "Test Title");
        testIssueId = res.body._id;
        done();
      });
  });

  test('Create an issue with only required fields', function (done) {
    chai.request(server)
      .post(`/api/issues/${testProject}`)
      .send({
        issue_title: "Required Fields Only",
        issue_text: "Some text",
        created_by: "Tester"
      })
      .end((err, res) => {
        assert.isObject(res.body);
        assert.propertyVal(res.body, 'issue_title', "Required Fields Only");
        done();
      });
  });

  test('Create an issue with missing required fields', function (done) {
    chai.request(server)
      .post(`/api/issues/${testProject}`)
      .send({ assigned_to: "Dev" })
      .end((err, res) => {
        assert.isObject(res.body);
        assert.propertyVal(res.body, 'error', 'required field(s) missing');
        done();
      });
  });

  test('View issues on a project', function (done) {
    chai.request(server)
      .get(`/api/issues/${testProject}`)
      .end((err, res) => {
        assert.isArray(res.body);
        done();
      });
  });

  test('View issues on a project with one filter', function (done) {
    chai.request(server)
      .get(`/api/issues/${testProject}?created_by=Tester`)
      .end((err, res) => {
        assert.isArray(res.body);
        done();
      });
  });

  test('View issues on a project with multiple filters', function (done) {
    chai.request(server)
      .get(`/api/issues/${testProject}?created_by=Tester&issue_title=Test Title`)
      .end((err, res) => {
        assert.isArray(res.body);
        done();
      });
  });

  test('Update one field on an issue', function (done) {
    chai.request(server)
      .put(`/api/issues/${testProject}`)
      .send({ _id: testIssueId, issue_text: "Updated Text" })
      .end((err, res) => {
        assert.isObject(res.body);
        assert.propertyVal(res.body, 'result', "successfully updated");
        done();
      });
  });

  test('Update multiple fields on an issue', function (done) {
    chai.request(server)
      .put(`/api/issues/${testProject}`)
      .send({ _id: testIssueId, issue_text: "New Text", assigned_to: "New Dev" })
      .end((err, res) => {
        assert.isObject(res.body);
        assert.propertyVal(res.body, 'result', "successfully updated");
        done();
      });
  });

  test('Update an issue with missing _id', function (done) {
    chai.request(server)
      .put(`/api/issues/${testProject}`)
      .send({ issue_text: "Should fail" })
      .end((err, res) => {
        assert.isObject(res.body);
        assert.propertyVal(res.body, 'error', 'missing _id');
        done();
      });
  });

  test('Update an issue with no fields to update', function (done) {
    chai.request(server)
      .put(`/api/issues/${testProject}`)
      .send({ _id: testIssueId })
      .end((err, res) => {
        assert.isObject(res.body);
        assert.propertyVal(res.body, 'error', 'no update field(s) sent');
        done();
      });
  });

  test('Update an issue with an invalid _id', function (done) {
    chai.request(server)
      .put(`/api/issues/${testProject}`)
      .send({ _id: "invalidID", issue_text: "Should fail" })
      .end((err, res) => {
        assert.isObject(res.body);
        assert.propertyVal(res.body, 'error', 'could not update');
        done();
      });
  });

  test('Delete an issue', function (done) {
    chai.request(server)
      .delete(`/api/issues/${testProject}`)
      .send({ _id: testIssueId })
      .end((err, res) => {
        assert.isObject(res.body);
        assert.propertyVal(res.body, 'result', "successfully deleted");
        done();
      });
  });

  test('Delete an issue with an invalid _id', function (done) {
    chai.request(server)
      .delete(`/api/issues/${testProject}`)
      .send({ _id: "invalidID" })
      .end((err, res) => {
        assert.isObject(res.body);
        assert.propertyVal(res.body, 'error', 'could not delete');
        done();
      });
  });

  test('Delete an issue with missing _id', function (done) {
    chai.request(server)
      .delete(`/api/issues/${testProject}`)
      .send({})
      .end((err, res) => {
        assert.isObject(res.body);
        assert.propertyVal(res.body, 'error', 'missing _id');
        done();
      });
  });
});
