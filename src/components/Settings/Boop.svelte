<script>
</script>

<style>
    @keyframes boop {
        0% {
            transform: rotate(0deg);
        }
        20% {
            transform: rotate(-15deg);
        }
        40% {
            transform: rotate(15deg);
        }
        60% {
            transform: rotate(-7deg);
        }
        80% {
            transform: rotate(7deg);
        }
        90% {
            transform: rotate(-3deg);
        }
        95% {
            transform: rotate(2deg);
        }
        100% {
            transform: rotate(0deg);
        }
    }
    .boop {
        display: inline-block;
    }
    .hover-container:hover .boop {
        animation: 1s boop forwards running;
    }
</style>

<span class="hover-container">
    <a
        class="flex justify-center items-center gap-1 text-white text-base outline-dashed outline-[#464646] outline-1 p-3 rounded bg-transparent hover:bg-[#2793d6] hover:outline duration-100 active:scale-[98%]"
        href="https://ko-fi.com/R6R1WK3Y"
        target="_blank"
    >
        <img src="https://storage.ko-fi.com/cdn/cup-border.png" alt="Cup" class="w-7 boop"/>
        Support me on Ko-fi
    </a>
</span>
