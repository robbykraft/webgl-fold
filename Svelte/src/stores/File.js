import { get, writable } from "svelte/store";

// file_frames, the first element [0] is the top layer frame itself.
// even if file_frames does not exist, [0] will be filled.
export const frames = writable([]);

// we can only visualize one frame at a time.
// even if file_frames does not exist, this will be filled
export const frame = writable({});

// when frameIndex updates, set "frame" to be
// the currently selected index in "frames"
export const frameIndex = writable(0);

// the origami (FOLD object)
export const FOLD = writable({});

// if the file is modified by this program,
// offer to the user to be able to download it.
export const fileCanDownload = writable(false);

// the example dropdown. various places (drag-and-drop, Settings file dialog)
// will want to reset this when the user loads a local file.
export const selectedExample = writable("placeholder");

/**
 * "soft" modify a FOLD file. the same file is loaded but it's
 * slightly modified, so we still want to trigger a refresh on
 * all components, but we don't want the frameIndex to change
 */
export const modifyFrame = (object) => {
	if (!object) { return; }
	const cachedIndex = get(frameIndex);
	switch (get(frameIndex)) {
	case 0:
		FOLD.set({...get(FOLD), ...object });
		break;
	default:
		const fold = get(FOLD);
		fold.file_frames[get(frameIndex) - 1] = {
			...fold.file_frames[get(frameIndex) - 1],
			...object,
		};
		FOLD.set({ ...fold });
		break;
	}
	fileCanDownload.set(true);
	console.log("setting cachedIndex", cachedIndex);
	frameIndex.set(cachedIndex);
};




// import { flattenFrame } from "rabbit-ear/graph/fileFrames.js";

// const getFileFrames = (foldFile) => !foldFile.file_frames
// 	? [flattenFrame(foldFile, 0)]
// 	: Array.from(Array(foldFile.file_frames.length + 1))
// 		.map((_, i) => flattenFrame(foldFile, i));

// const {
// 	subscribe: subscribeFrameIndex,
// 	update: updateFrameIndex,
// 	set: setFrameIndex,
// } = writable(0);

// export const frameIndex = {
// 	subscribe: subscribeFrameIndex,
// 	update: updateFrameIndex,
// 	set: (index) => {
// 		setFrameIndex(index);
// 		frame.set(get(frames)[index]);
// 	},
// };

// const {
// 	subscribe: subscribeFOLD,
// 	update: updateFOLD,
// 	set: setFOLD,
// } = writable({});

// export const FOLD = {
// 	subscribe: subscribeFOLD,
// 	update: updateFOLD,
// 	set: (obj) => {
// 		setFOLD(obj);
// 		frames.set(getFileFrames(obj));
// 		frameIndex.set(0);
// 	}
// };
