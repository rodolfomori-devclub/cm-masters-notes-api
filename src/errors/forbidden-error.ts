import { AppError } from './app-error';

export class ForbiddenError extends AppError {
	constructor(message?: string) {
		super(message || 'Forbidden Error.', 403);
	}
}
