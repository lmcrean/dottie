import getById from '../../detail/api/getById/Request';
import getList from './getList/Request';
import deleteById from './deleteById/Request';
import postSend from '../../results/components/save-results-button/api/postSend/Request';
// import putUpdate from './putUpdate/Request'; // Removed this import for now

export { getById, getList, deleteById, postSend }; // Removed putUpdate from export

// For backward compatibility with default exports
export default {
  getById,
  getList,
  delete: deleteById,
  postSend
  // putUpdate // Removed putUpdate from default export
};
