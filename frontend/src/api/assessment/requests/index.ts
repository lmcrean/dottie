import getById from './getById/Request';
import getList from './getList/Request';
import deleteById from './deleteById/Request';
import postSend from './postSend/Request';
import putUpdate from './putUpdate/Request';

export { getById, getList, deleteById, postSend, putUpdate };

// For backward compatibility with default exports
export default {
  getById,
  getList,
  delete: deleteById,
  postSend,
  putUpdate
};
