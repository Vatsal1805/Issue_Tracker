const Issue = require('../models/Issue');

class IssueRepository {
    async createIssue(issueData) {
        return Issue.create(issueData);
    }
    async findByUser(userID) {
        return await Issue.find({ createdBy: userID }).sort({ createdAt: -1 });
    }
    async deleteIssue(issueID, userID) {
        return Issue.findOneAndDelete({ _id: issueID, createdBy: userID });
    }
}

module.exports = new IssueRepository();