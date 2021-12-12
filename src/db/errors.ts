/* eslint-disable import/prefer-default-export */

class ConflictError extends Error {
  isConflict: boolean;

  conflict: any;

  constructor(msg, conflictingField?) {
    super(msg);
    this.isConflict = true;
    this.conflict = conflictingField;
  }
}

export { ConflictError };
