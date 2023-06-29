let reload_callback = () => {};

export const setReload = (cb: typeof reload_callback) => {
  if (typeof cb === 'function') reload_callback = cb;
};

export const reload = () => reload_callback();
