import { getList, getById, postSend, deleteById as deleteAssessment } from "./requests";

// Export types
export * from "./types";

// Export individual endpoints
export {
  getList,
  getById,
  postSend as sendAssessment,
  deleteAssessment
};

// Assessment API object for backward compatibility
export const assessmentApi = {
  list: getList,
  getById,
  sendAssessment: postSend,
  delete: deleteAssessment
};

export default assessmentApi; 