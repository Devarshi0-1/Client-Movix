import { TUser } from '@/types';
import type { Dispatch, FC, ReactNode, SetStateAction } from 'react';
import { createContext, useContext, useState } from 'react';

interface AuthContextProps {
	children: ReactNode;
}

interface AuthUserContext {
	authUser: TUser | null;
	setAuthUser: Dispatch<SetStateAction<TUser | null>>;
}

const AuthContext = createContext<Partial<AuthUserContext>>({});

export const AuthContextProvider: FC<AuthContextProps> = ({ children }) => {
	const [authUser, setAuthUser] = useState<TUser | null>(
		JSON.parse(localStorage.getItem('user')!)
	);

	return (
		<AuthContext.Provider value={{ authUser, setAuthUser }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuthContext = () => {
	return useContext(AuthContext);
};
