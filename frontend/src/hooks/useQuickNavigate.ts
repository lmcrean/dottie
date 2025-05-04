import { useNavigate, useLocation, NavigateOptions } from 'react-router-dom';

export function useQuickNavigate() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const isQuickResponse = params.get('mode') === 'quickresponse';

  const quickNavigate = (path: string, options: NavigateOptions = {}) => {
    if (isQuickResponse) {
      const [basePath, existingQuery = ''] = path.split('?');
      const newParams = new URLSearchParams(existingQuery);
      newParams.set('mode', 'quickresponse');
      const newPath = `${basePath}?${newParams.toString()}`;
      navigate(newPath, options);
    } else {
      navigate(path, options);
    }
  };

  return { quickNavigate, isQuickResponse };
}
