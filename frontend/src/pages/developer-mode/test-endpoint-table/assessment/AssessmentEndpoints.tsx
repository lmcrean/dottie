import React from 'react';
import { EndpointTable } from '../../page-components';
import PostAssessmentSend from './post-assessment-send/EndpointRow';
import GetAssessmentList from './get-assessment-list/EndpointRow';
import GetAssessmentById from './get-assessment-by-id/EndpointRow';
import DeleteAssessmentById from './delete-assessment-by-id/EndpointRow';

/**
 * Container component for assessment endpoints
 */
export default function AssessmentEndpoints() {
  return (
    <EndpointTable title="Assessment Endpoints">
      <PostAssessmentSend />
      <GetAssessmentList />
      <GetAssessmentById />
      <DeleteAssessmentById />
    </EndpointTable>
  );
}
