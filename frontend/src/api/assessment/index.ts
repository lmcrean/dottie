import { getList, getById, postSend, putUpdate, deleteById as deleteAssessment } from './requests';

// Export types
export * from './types';

// Export individual endpoints
export { getList, getById, postSend as sendAssessment, putUpdate as update, deleteAssessment };

// Assessment API object for backward compatibility
export const assessmentApi = {
  list: getList,
  getById,
  sendAssessment: postSend,
  update: putUpdate,
  delete: deleteAssessment
};

export default assessmentApi;
