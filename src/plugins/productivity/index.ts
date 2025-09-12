/**
 * Productivity Plugin Suite - Main Entry Point
 * Exports all productivity plugins for dynamic loading
 */

export { CalendarPlugin } from './CalendarPlugin';
export { EmailPlugin } from './EmailPlugin';
export { TaskPlugin } from './TaskPlugin';
export { NotePlugin } from './NotePlugin';

// Plugin registry for dynamic loading
export const PRODUCTIVITY_PLUGINS = {
  calendar: CalendarPlugin,
  email: EmailPlugin,
  tasks: TaskPlugin,
  notes: NotePlugin
};

export default PRODUCTIVITY_PLUGINS;