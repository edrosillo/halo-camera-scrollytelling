"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

const FRAME_COUNT = 113; // 0 to 112

export default function CameraScroll() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [imagesLoaded, setImagesLoaded] = useState(0);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const frameIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);

    useEffect(() => {
        const loadedImages: HTMLImageElement[] = [];
        let loadedCount = 0;

        for (let i = 0; i < FRAME_COUNT; i++) {
            const img = new Image();
            const frameNum = String(i).padStart(3, "0");
            img.src = `/sequence/exploded_camera_video${frameNum}.webp`;
            img.onload = () => {
                loadedCount++;
                setImagesLoaded(loadedCount);
            };
            loadedImages.push(img);
        }
        setImages(loadedImages);
    }, []);

    useEffect(() => {
        if (imagesLoaded < FRAME_COUNT || images.length === 0) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const drawFrame = () => {
            const index = Math.min(
                FRAME_COUNT - 1,
                Math.max(0, Math.floor(frameIndex.get()))
            );
            const image = images[index];

            if (image && image.complete) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;

                const hRatio = canvas.width / image.width;
                const vRatio = canvas.height / image.height;
                const ratio = Math.min(hRatio, vRatio);
                const centerShiftX = (canvas.width - image.width * ratio) / 2;
                const centerShiftY = (canvas.height - image.height * ratio) / 2;

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(
                    image,
                    0,
                    0,
                    image.width,
                    image.height,
                    centerShiftX,
                    centerShiftY,
                    image.width * ratio,
                    image.height * ratio
                );
            }
        };

        drawFrame();

        const unsubscribe = frameIndex.on("change", () => {
            requestAnimationFrame(drawFrame);
        });

        window.addEventListener("resize", drawFrame);

        return () => {
            unsubscribe();
            window.removeEventListener("resize", drawFrame);
        };
    }, [imagesLoaded, frameIndex, images]);

    const opacity1 = useTransform(scrollYProgress, [0, 0.15, 0.25], [1, 1, 0]);
    const y1 = useTransform(scrollYProgress, [0, 0.25], [0, -50]);

    const opacity2 = useTransform(
        scrollYProgress,
        [0.25, 0.35, 0.45, 0.55],
        [0, 1, 1, 0]
    );
    const x2 = useTransform(
        scrollYProgress,
        [0.25, 0.35, 0.55],
        [-50, 0, 0]
    );

    const opacity3 = useTransform(
        scrollYProgress,
        [0.55, 0.65, 0.75, 0.85],
        [0, 1, 1, 0]
    );
    const x3 = useTransform(
        scrollYProgress,
        [0.55, 0.65, 0.85],
        [50, 0, 0]
    );

    const opacity4 = useTransform(scrollYProgress, [0.85, 0.95, 1], [0, 1, 1]);
    const y4 = useTransform(scrollYProgress, [0.85, 1], [50, 0]);

    return (
        <div ref={containerRef} className="relative h-[400vh] bg-[#050505] w-full">
            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
                {imagesLoaded < FRAME_COUNT && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#050505]">
                        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                    </div>
                )}

                <canvas ref={canvasRef} className="w-full h-full object-contain" />

                <div className="absolute inset-0 pointer-events-none flex flex-col justify-center">
                    <motion.div
                        style={{ opacity: opacity1, y: y1 }}
                        className="absolute w-full text-center top-1/2 -translate-y-1/2"
                    >
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-4">
                            Halo X
                        </h1>
                        <p className="text-xl md:text-3xl font-light text-white/60">
                            Breathtaking Images.
                        </p>
                    </motion.div>

                    <motion.div
                        style={{ opacity: opacity2, x: x2 }}
                        className="absolute left-[5%] md:left-[10%] lg:left-[15%] text-left max-w-sm md:max-w-md top-1/2 -translate-y-1/2"
                    >
                        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-4">
                            Precision Optics.
                        </h2>
                        <p className="text-lg text-white/60">
                            Engineered to perfection. Every element works in harmony to deliver unmatched clarity and detail.
                        </p>
                    </motion.div>

                    <motion.div
                        style={{ opacity: opacity3, x: x3 }}
                        className="absolute right-[5%] md:right-[10%] lg:right-[15%] text-right max-w-sm md:max-w-md top-1/2 -translate-y-1/2"
                    >
                        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-4">
                            Full-Frame BSI Sensor.
                        </h2>
                        <p className="text-lg text-white/60">
                            Experience the power of a back-illuminated sensor, capturing more light for stunning low-light performance.
                        </p>
                    </motion.div>

                    <motion.div
                        style={{ opacity: opacity4, y: y4 }}
                        className="absolute w-full text-center bottom-[20%] md:bottom-[15%]"
                    >
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white mb-8">
                            Capture Your Vision.
                        </h2>
                        <button className="pointer-events-auto bg-white text-black px-10 py-5 rounded-full font-medium tracking-wide hover:bg-gray-200 transition-colors text-lg">
                            Pre-order to be the first
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
