const IssueService = require('../services/IssueService');

class IssueHandler {
    constructor() {
        this.issueService = new IssueService();
    }

    async createIssue(req, res, next) {
        try {
            const newIssue = await this.issueService.createIssue(req.body, req.user.id);
            res.status(201).json(newIssue);
        } catch (error) {
            next(error);
        }   
    }
    
    async getUserIssues(req, res, next) {
        try {
            const issues = await this.issueService.getUserIssues(req.user.id);
            res.status(200).json(issues);
        } catch (error) {
            next(error);
        }
    }

    async deleteIssue(req, res, next) {
        try {
            const deletedIssue = await this.issueService.deleteIssue(req.params.id, req.user.id);
            res.status(200).json(deletedIssue);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = IssueHandler;