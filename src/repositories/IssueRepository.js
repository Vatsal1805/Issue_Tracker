const Issue = require('../models/Issue');

class IssueRepository {
    async createIssue(issueData) {
        return Issue.create(issueData);
    }
    async findByUser(userID) {
        return await Issue.find({ userID }).sort({ createdAt: -1 });
    }
    async deleteIssue(issueID, userID) {
        return Issue.findOneAndDelete({ _id: issueID, userID });
    }
}

module.exports = new IssueRepository();