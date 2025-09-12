"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskPriority = exports.PermissionScope = exports.DeviceStatus = exports.DeviceType = exports.SecurityLevel = exports.VisualType = exports.UIElementType = exports.ConfirmationLevel = exports.ActionType = exports.PermissionLevel = exports.PermissionCategory = exports.ComplexityLevel = exports.PriorityLevel = exports.PluginCategory = exports.ResponseType = exports.RequestSource = exports.RequestType = void 0;
var RequestType;
(function (RequestType) {
    RequestType["VOICE"] = "voice";
    RequestType["TEXT"] = "text";
    RequestType["GESTURE"] = "gesture";
    RequestType["TOUCH"] = "touch";
    RequestType["API"] = "api";
    RequestType["WEBHOOK"] = "webhook";
})(RequestType || (exports.RequestType = RequestType = {}));
var RequestSource;
(function (RequestSource) {
    RequestSource["MOBILE"] = "mobile";
    RequestSource["DESKTOP"] = "desktop";
    RequestSource["WEB"] = "web";
    RequestSource["HARDWARE_HUB"] = "hardware_hub";
    RequestSource["CAR"] = "car";
    RequestSource["SMART_HOME"] = "smart_home";
    RequestSource["API"] = "api";
})(RequestSource || (exports.RequestSource = RequestSource = {}));
var ResponseType;
(function (ResponseType) {
    ResponseType["TEXT"] = "text";
    ResponseType["VOICE"] = "voice";
    ResponseType["VISUAL"] = "visual";
    ResponseType["ACTION"] = "action";
    ResponseType["DATA"] = "data";
    ResponseType["ERROR"] = "error";
    ResponseType["CONFIRMATION"] = "confirmation";
    ResponseType["PROGRESS"] = "progress";
})(ResponseType || (exports.ResponseType = ResponseType = {}));
var PluginCategory;
(function (PluginCategory) {
    PluginCategory["CORE_UTILITIES"] = "core_utilities";
    PluginCategory["PRODUCTIVITY"] = "productivity";
    PluginCategory["SMART_HOME"] = "smart_home";
    PluginCategory["HEALTHCARE"] = "healthcare";
    PluginCategory["SAFETY_SECURITY"] = "safety_security";
    PluginCategory["CREATIVE"] = "creative";
    PluginCategory["ENTERPRISE"] = "enterprise";
    PluginCategory["MEDIA_ENTERTAINMENT"] = "media_entertainment";
    PluginCategory["JOB_SITES_INDUSTRIAL"] = "job_sites_industrial";
    PluginCategory["VEHICLE_CONTROL"] = "vehicle_control";
})(PluginCategory || (exports.PluginCategory = PluginCategory = {}));
var PriorityLevel;
(function (PriorityLevel) {
    PriorityLevel[PriorityLevel["CRITICAL"] = 1] = "CRITICAL";
    PriorityLevel[PriorityLevel["HIGH"] = 2] = "HIGH";
    PriorityLevel[PriorityLevel["MEDIUM"] = 3] = "MEDIUM";
    PriorityLevel[PriorityLevel["LOW"] = 4] = "LOW";
    PriorityLevel[PriorityLevel["FUTURE"] = 5] = "FUTURE";
})(PriorityLevel || (exports.PriorityLevel = PriorityLevel = {}));
var ComplexityLevel;
(function (ComplexityLevel) {
    ComplexityLevel["SMALL"] = "S";
    ComplexityLevel["MEDIUM"] = "M";
    ComplexityLevel["LARGE"] = "L";
})(ComplexityLevel || (exports.ComplexityLevel = ComplexityLevel = {}));
var PermissionCategory;
(function (PermissionCategory) {
    PermissionCategory["SYSTEM"] = "system";
    PermissionCategory["USER_DATA"] = "user_data";
    PermissionCategory["DEVICE_CONTROL"] = "device_control";
    PermissionCategory["NETWORK_ACCESS"] = "network_access";
    PermissionCategory["AI_SERVICES"] = "ai_services";
    PermissionCategory["INTEGRATIONS"] = "integrations";
    PermissionCategory["STORAGE"] = "storage";
    PermissionCategory["COMMUNICATION"] = "communication";
})(PermissionCategory || (exports.PermissionCategory = PermissionCategory = {}));
var PermissionLevel;
(function (PermissionLevel) {
    PermissionLevel["PUBLIC"] = "public";
    PermissionLevel["INTERNAL"] = "internal";
    PermissionLevel["CONFIDENTIAL"] = "confidential";
    PermissionLevel["RESTRICTED"] = "restricted";
})(PermissionLevel || (exports.PermissionLevel = PermissionLevel = {}));
var ActionType;
(function (ActionType) {
    ActionType["DEVICE_CONTROL"] = "device_control";
    ActionType["DATA_ACCESS"] = "data_access";
    ActionType["COMMUNICATION"] = "communication";
    ActionType["AUTOMATION"] = "automation";
    ActionType["INTEGRATION"] = "integration";
    ActionType["AI_PROCESSING"] = "ai_processing";
})(ActionType || (exports.ActionType = ActionType = {}));
var ConfirmationLevel;
(function (ConfirmationLevel) {
    ConfirmationLevel["NONE"] = "none";
    ConfirmationLevel["LOW"] = "low";
    ConfirmationLevel["MEDIUM"] = "medium";
    ConfirmationLevel["HIGH"] = "high";
    ConfirmationLevel["CRITICAL"] = "critical";
})(ConfirmationLevel || (exports.ConfirmationLevel = ConfirmationLevel = {}));
var UIElementType;
(function (UIElementType) {
    UIElementType["TEXT"] = "text";
    UIElementType["BUTTON"] = "button";
    UIElementType["INPUT"] = "input";
    UIElementType["CARD"] = "card";
    UIElementType["LIST"] = "list";
    UIElementType["CHART"] = "chart";
    UIElementType["MAP"] = "map";
    UIElementType["MEDIA"] = "media";
})(UIElementType || (exports.UIElementType = UIElementType = {}));
var VisualType;
(function (VisualType) {
    VisualType["TEXT"] = "text";
    VisualType["IMAGE"] = "image";
    VisualType["VIDEO"] = "video";
    VisualType["CHART"] = "chart";
    VisualType["MAP"] = "map";
    VisualType["AR"] = "ar";
    VisualType["VR"] = "vr";
})(VisualType || (exports.VisualType = VisualType = {}));
var SecurityLevel;
(function (SecurityLevel) {
    SecurityLevel[SecurityLevel["LOW"] = 0] = "LOW";
    SecurityLevel[SecurityLevel["MEDIUM"] = 1] = "MEDIUM";
    SecurityLevel[SecurityLevel["HIGH"] = 2] = "HIGH";
})(SecurityLevel || (exports.SecurityLevel = SecurityLevel = {}));
var DeviceType;
(function (DeviceType) {
    DeviceType[DeviceType["MOBILE"] = 0] = "MOBILE";
    DeviceType[DeviceType["DESKTOP"] = 1] = "DESKTOP";
    DeviceType[DeviceType["HUB"] = 2] = "HUB";
})(DeviceType || (exports.DeviceType = DeviceType = {}));
var DeviceStatus;
(function (DeviceStatus) {
    DeviceStatus[DeviceStatus["ONLINE"] = 0] = "ONLINE";
    DeviceStatus[DeviceStatus["OFFLINE"] = 1] = "OFFLINE";
})(DeviceStatus || (exports.DeviceStatus = DeviceStatus = {}));
;
var PermissionScope;
(function (PermissionScope) {
    PermissionScope[PermissionScope["USER"] = 0] = "USER";
    PermissionScope[PermissionScope["DEVICE"] = 1] = "DEVICE";
    PermissionScope[PermissionScope["SYSTEM"] = 2] = "SYSTEM";
})(PermissionScope || (exports.PermissionScope = PermissionScope = {}));
var TaskPriority;
(function (TaskPriority) {
    TaskPriority[TaskPriority["LOW"] = 0] = "LOW";
    TaskPriority[TaskPriority["MEDIUM"] = 1] = "MEDIUM";
    TaskPriority[TaskPriority["HIGH"] = 2] = "HIGH";
})(TaskPriority || (exports.TaskPriority = TaskPriority = {}));
//# sourceMappingURL=ZeekyTypes.js.map