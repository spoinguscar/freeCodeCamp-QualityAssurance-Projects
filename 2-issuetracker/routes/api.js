'use strict';
const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let issues = []; // In-memory storage for issues

module.exports = function (app) {
  app.route('/api/issues/:project')
    
    // GET: Retrieve all issues for a project
    .get((req, res) => {
      let project = req.params.project;
      let projectIssues = issues.filter(issue => issue.project === project);
      
      for (let key in req.query) {
        projectIssues = projectIssues.filter(issue => issue[key] == req.query[key]);
      }
      
      res.status(200).json(projectIssues);
    })
    
    // POST: Create a new issue
    .post((req, res) => {
      let { issue_title, issue_text, created_by, assigned_to, status_text } = req.body;
      if (!issue_title || !issue_text || !created_by) {
        return res.json({ error: 'required field(s) missing' });
      }
      
      let newIssue = {
        _id: `${Date.now()}`, // Unique ID
        project: req.params.project,
        issue_title,
        issue_text,
        created_by,
        assigned_to: assigned_to || '',
        status_text: status_text || '',
        created_on: new Date().toISOString(),
        updated_on: new Date().toISOString(),
        open: true
      };
      
      issues.push(newIssue);
      res.status(200).json(newIssue);
    })
    
    // PUT: Update an issue
    .put((req, res) => {
      let { _id, ...updates } = req.body;
      if (!_id) return res.json({ error: 'missing _id' });

      if (Object.keys(updates).length === 0) {
        return res.json({ error: 'no update field(s) sent', '_id': _id });
      }
      
      let issue = issues.find(issue => issue._id === _id);
      if (!issue || !issue.open) return res.json({ error: 'could not update', '_id': _id });
      
      
      
      Object.assign(issue, updates, { updated_on: new Date().toISOString() });
      res.status(200).json({ result: 'successfully updated', _id });
    })
    
    // DELETE: Remove an issue
    .delete((req, res) => {
      let { _id } = req.body;
      if (!_id) return res.json({ error: 'missing _id' });
      
      let issueIndex = issues.findIndex(issue => issue._id === _id);
      if (issueIndex === -1) return res.json({ error: 'could not delete', '_id': _id });
      
      issues.splice(issueIndex, 1);
      res.status(200).json({ result: 'successfully deleted', '_id': _id });
    });
};
