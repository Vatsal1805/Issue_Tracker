const IssueRepository = require('../repositories/IssueRepository');
const ApiError = require('../errors/Apierror');

class IssueService {
    async createIssue(data, userID) {
        const { title, description, type, priority } = data;
        if (!title || !description || !type) {
            throw new ApiError(400, 'Title, description, and type are required');
        }
        const newIssue = await IssueRepository.createIssue({
            title,
            description,
            type,
            priority: priority || 'Medium',
            createdBy: userID
        });
        return newIssue;
    }

    async getUserIssues(userID) {
        const issues = await IssueRepository.findByUser(userID);
        return issues;
    }

    async deleteIssue(issueID, userID) {
        const deletedIssue = await IssueRepository.deleteIssue(issueID, userID);
        if (!deletedIssue) {
            throw new ApiError(404, 'Issue not found or unauthorized');
        }
        return deletedIssue;
    }
}

module.exports = IssueService;