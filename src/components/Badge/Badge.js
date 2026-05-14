import { jsx as _jsx } from "react/jsx-runtime";
import './Badge.css';
export function Badge({ label, variant }) {
    return _jsx("span", { className: `badge badge--${variant}`, children: label });
}
