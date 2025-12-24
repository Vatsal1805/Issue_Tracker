const router = require('express').Router();
const IssueHandler = require('../handlers/IssueHandler');
const authMiddleware = require('../middlewares/AuthMiddleware');

const issueHandler = new IssueHandler();

router.post('/', authMiddleware.authenticate.bind(authMiddleware), issueHandler.createIssue.bind(issueHandler));
router.get('/', authMiddleware.authenticate.bind(authMiddleware), issueHandler.getUserIssues.bind(issueHandler));
router.delete('/:id', authMiddleware.authenticate.bind(authMiddleware), issueHandler.deleteIssue.bind(issueHandler));

module.exports = router;