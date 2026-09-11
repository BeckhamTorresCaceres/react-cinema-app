export interface ServerUser {
  id?: string | number;
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  roleId?: string;
  phone?: string;
  active?: boolean;
  avatar?: string;
  membershipId?: string;
  memberSince?: string;
  expiryDate?: string;
  status?: string;
}
