import { createContext, useContext, useReducer, type ReactNode } from "react";
import {
	wishlistReducer,
	type WishlistState,
} from "../reducers/wishlistReducer";

type WishlistContextValue = {
	wishlist: WishlistState;
	addItem: (itemId: string) => void;
	removeItem: (itemId: string) => void;
	clearWishlist: () => void;
};

const WishlistContext = createContext<WishlistContextValue | undefined>(
	undefined,
);

export function WishlistProvider({ children }: { children: ReactNode }) {
	const [wishlist, dispatch] = useReducer(wishlistReducer, []);

	const value: WishlistContextValue = {
		wishlist,
		addItem: (itemId) => dispatch({ type: "add", itemId }),
		removeItem: (itemId) => dispatch({ type: "remove", itemId }),
		clearWishlist: () => dispatch({ type: "clear" }),
	};

	return (
		<WishlistContext.Provider value={value}>
			{children}
		</WishlistContext.Provider>
	);
}

export function useWishlist() {
	const context = useContext(WishlistContext);
	if (context === undefined) {
		throw new Error("useWishlist must be used within a WishlistProvider");
	}
	return context;
}
