import { Post } from '../types';

export function getDerivedRegistrationStatus(post: Post): 'open' | 'closed' | 'archived' | '' {
  const status = post.metadata?.registration_status || '';
  if (status === 'open' && post.metadata?.registration_deadline) {
    const deadline = new Date(post.metadata.registration_deadline).getTime();
    if (Date.now() > deadline) {
      return 'closed';
    }
  }
  return status;
}
