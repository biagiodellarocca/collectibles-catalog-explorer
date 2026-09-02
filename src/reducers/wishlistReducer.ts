export type WishlistState = string[];

export type WishlistAction =
	| { type: "add"; itemId: string }
	| { type: "remove"; itemId: string }
	| { type: "clear" };

export function wishlistReducer(
	state: WishlistState,
	action: WishlistAction,
): WishlistState {
	switch (action.type) {
		case "add":
			if (state.includes(action.itemId)) return state;
			return [...state, action.itemId];
		case "remove":
			return state.filter((item) => item !== action.itemId);
		case "clear":
			return [];
		default: {
			const _exhaustiveCheck: never = action;
			return _exhaustiveCheck;
		}
	}
}
