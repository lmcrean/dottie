import getById from '../components/results-table/getById/Request';
import getList from '../list/api/getList/Request';
import deleteById from '../components/delete-button/api/deleteById/Request';
import postSend from '../results/components/save-results-button/api/postSend/Request';
// Import from correct locations for these (paths need to be fixed based on project structure)
// import getList from './requests/getList/Request';
// import deleteById from './requests/deleteById/Request';

// Export types
export * from './types';

// Export individual endpoints
export { getList, getById, postSend as sendAssessment, deleteById as deleteAssessment };
// export { getList, deleteById as deleteAssessment }; - these need proper imports first

// Assessment API object for backward compatibility
export const assessmentApi = {
  list: getList,
  getById,
  sendAssessment: postSend,
  delete: deleteById
};

export default assessmentApi;
