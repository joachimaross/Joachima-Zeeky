// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "ZeekySDK",
    platforms: [
        .iOS(.v15),
        .macOS(.v12)
    ],
    products: [
        .library(
            name: "ZeekySDK",
            targets: ["ZeekySDK"]
        ),
    ],
    dependencies: [
        .package(url: "https://github.com/Alamofire/Alamofire.git", from: "5.8.0"),
        .package(url: "https://github.com/SwiftyJSON/SwiftyJSON.git", from: "5.0.0")
    ],
    targets: [
        .target(
            name: "ZeekySDK",
            dependencies: [
                "Alamofire",
                "SwiftyJSON"
            ],
            path: "Sources/ZeekySDK"
        ),
        .testTarget(
            name: "ZeekySDKTests",
            dependencies: ["ZeekySDK"],
            path: "Tests/ZeekySDKTests"
        ),
    ]
)