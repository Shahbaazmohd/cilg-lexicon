"use client";
import React from "react";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";

const people = [
  {
    id: 1,
    name: "Reema Yadav",
    designation: "Editor-in-Chief",
    image:
      "https://lh5.googleusercontent.com/gJFjHwts5N_zP5ebcUbIl3izxqgqETdkm8cmAss4wZ6rHlA9ylvMZaq5WsjfP3JuPpJNn21vfo5BJpPJANgBPhqpm5f-u3k2MSs-ZRSl5ashEGCvNruTqqQfExbZXE7um6bI5mUdIZ_y4bCFEn_Is3snyCarMzlb0ftd8oqn_QwH-9EwwWen3A=w1280",
  },
  {
    id: 2,
    name: "Niyati Pandey",
    designation: "Managing Editor",
    image:
      "https://lh6.googleusercontent.com/us9O8s6QtEHGLW_UxGZG4-QGZzJF2ZKZHXr3JbjtSzN2wCr5W1AwP8UvxjBDLafipu6FIhEKrEEXk2XAIRu-J_5ck_n9pr335v0IS3UdGxYs_Qfzl_K330X3KNDh_Od_SVTML0N9QLT_Pu6uX4OOCYzH7Ny8WX2a8wRmnilH1rjpBl83GKhCJw=w1280",
  },
  {
    id: 3,
    name: "Akshat Tanwar",
    designation: "Editorial Board Member",
    image:
      "https://lh4.googleusercontent.com/2N0DmsC13KgwK-ZWNanx5ZIPTJoFIkpTjag5OZ601CSrJ9wWrMli8K_uulnNaA2ct5o84XFmpGA-cXf9b3hl6G1D_QZeDzf2d3mMN1JZajgNUNjCu-Y2Gvq44Z9aC7rwcnNGwLRvlctYHm6kWpztxHrqzrOTHw0IMDFmER2QaS4JnB9LxY_cCA=w1280",
  },
  {
    id: 4,
    name: "Aadya Kumar",
    designation: "Editorial Board Member",
    image:
      "https://lh3.googleusercontent.com/GTU1ZYjImRXc3SmHQdWAZ8pElCIv3ZOX5mPe_7T5as8AIKYRSMXumejGJ6IRK_vPeGEGD4O1Saw78mL5aq6wBKKVt6G_qnk_D0JoTaRxykZP0MJBjEGh8DjFw838ZD_q-wdxHydulBpCwGT1CpTmbnVDwu4GgnG0nrHzSb1BX3ubfzVHATSn=w1280",
  },
  {
    id: 5,
    name: "Vidhi Chug",
    designation: "Editorial Board Member",
    image:
      "https://lh5.googleusercontent.com/8Vgy6OsqzauqOT0KDrv6tO5-T5t1-ayKvSD3I1UqOTQZCuz3J-UsWeOLPSfqOhmQDGypZcboaRzbgVwbmwvuRCB-LejxfQ_WvmYwoMXD2dBxOiKB3fpOjGbKc768GPzpNVk4lt9jLgSsnY9oaFjrjbabsDSN4PlYLWP-nMYw1wrND3Krea3Bfw=w1280",
  },
  {
    id: 6,
    name: "Krish Sehrawat",
    designation: "Editorial Board Member",
    image:
      "https://lh5.googleusercontent.com/aD9o3lwfl_8HNXHKXiER81QXZBYOrhRHd4mSrKWKj5Izxx7epG0psdJ9qhlBdYdj1pQarfxqE5SGajnYdl9_iE0TGMTaCLbAxRHVpfrg3klkMwtSvwOmpZs4HNm7pEfiVEfLsOnJIh0ljpxsouvmc6XYLUt8I7T_YrYserNQWWTAvrqUs9boCg=w1280",
  },
  {
    id: 7,
    name: "Laksha Beniwal",
    designation: "Editorial Board Member",
    image:
      "https://lh5.googleusercontent.com/7NNL2YMoPM_Qy6e8ExRxqFxY-K68sFL4APgdXCFlQjdaMeCkzUNClj4tVuErqRyW996gcgNgwM86VtK8XTbmgnClWrLG0W4L0gqt3byehZ17V4DUa8Bnw5bXkcm0_nIaSloWRCuwJeQZXZiONnJyIoRVF1JtvcKYm9EYbcS1M-pNbw_kCutY=w1280",
  },
  {
    id: 8,
    name: "Ashish Kumar",
    designation: "Editorial Board Member",
    image:
      "https://lh3.googleusercontent.com/9OuiHM8eQHEKkfl2C9c_z_BIN-P3JwEFS3ivF_kHTTdrbiRavRWm_r6hPP5YG6hCoACdSSaIQDy-5Nd7POi_WEiNxUWrMe6jdmqyu0IAc3KkVraEJ6yJ_NqQaAdNGVtgCyA2AEBqXbkHOhOcBwu8kfm_YuMVY-oweaR-qktYCH2RS9THMquUbQ=w1280",
  },
  {
    id: 9,
    name: "Vibhor Sharma",
    designation: "Editorial Board Member",
    image:
      "https://lh4.googleusercontent.com/ecZnxmqVr1HBusJI5S0Oy6zHKTqxfWEou2g2RxjixyT2V-iOeCwvqwRRhuzwjjzzNlmz8ClgIo2ANNAA3k6S9GGKJviczELCOwS7tOjAEZ1ktCKgdSxLS5CV2AH5eDzIoCAS1ke_311Ck5begCQVUEnbvIWZA8YbrgFc0pYTbuRh8a4XvLQvBA=w1280",
  },
];

export default function AnimatedTooltipPreview() {
  return (
    <div className="flex flex-row items-center justify-center mb-24 w-full">
      <AnimatedTooltip items={people} />
    </div>
  );
} 