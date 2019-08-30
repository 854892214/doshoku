import moment from "moment-timezone";

export default {
    // baseURL: "http://47.88.78.43:8080/",
    // baseURL: "https://api.hantepay.cn/",
    // baseURL: "https://test.hantepay.cn/",
    // baseURL: "http://192.168.1.6:8080/",
    baseURL:"http://192.168.1.14:8080/",
    goodsImg: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAb90lEQVR4Xu1dfZQkRZGPqJkddnrw2KfnJ+rb5fg4PJQVBAFXRUTAk3t86CF+nSCHKHirs0xl9gyo7YPd7cxiZ3EVv05R8AtQFH2i4uk77oEuCop6KiLocgceixyICNO7TE/FvdyrwWXnoyKzq7uqurL+7cjIyF/Ur6sqIzICwV8eAY/Aggigx8Yj4BFYGAFPEH93eAQWQcATxN8eHgFPEH8PeATcEPBPEDfc/KiKIOAJUhFH+2W6IeAJ4oabH1URBDxBKuJov0w3BDxB3HDzoyqCgCdIRRztl+mGgCeIG25+VEUQ8ASpiKP9Mt0Q8ARxw82PqggCniAVcbRfphsCniBuuPlRFUHAE6QijvbLdEPAE8QNNz+qIgh4glTE0X6Zbgh4grjh5kdVBAFPkIo42i/TDQFPEDfc/KiKIOAJUhFH+2W6IeAJ4oabH1URBDxBKuJov0w3BDxB3HDzoyqCgCdIRRztl+mGgCeIG25+VEUQ8ASpiKP9Mt0Q8ARxw82PqggCniAVcbRfphsCniBuuPlRFUHAE6QijvbLdEPAE8QNNz+qIgh4glTE0X6Zbgh4grjh5kdlhECj0RgaGRk5mIieCwDPAoCXAsASAPg9ANyFiLfUarWbzjnnnEcymtJKjSeIFVxeuFMENm3a9Ffbt28/nogOA4DDiOiFiDiYopcA4DYi2kxE39m2bdvXG43Gtk5t4Yz3BOGg5GU6RkBr/QwiWgMA70TE3TtRSESPIOIX4jheW6/X/7sTXWljPUHSEPK/d4RAQozzEPFMANitI2VzB88Q0aVEFNbr9T9lrHuHOk+QbqDqde5AQGt9GhFdjIh7dBmSPxDRWVLKa7KexxMka0S9Pmg0GktrtdrlAPCPvYSDiD5vXuGklH/Oal5PkKyQ9Hp2IDA5Ofnkdrv9TQB4cR6QENEvEfFoIcTWLOb3BMkCRa9jBwJKqWcj4vUA8Dd5QkJE9yDiUUKIOzq1wxOkUwT9+B0IXHTRRX89MzNzMyIuLwIkRPSAialIKW/rxB5PkE7Q82N3IGCCfcPDw99HxBcVCRIiur3Vaq3sJGbiCVIkj5bUFq31R8zHcQfm/xwA7iCi+xDxfwGgRkRPR8Q9AcCQ7q9cdRPRR6SU57iO9wRxRc6Pm/3uOBERv+oAx6NEdBkRfaxer//nQuMbjcZgrVZ7CQC81mzlIuKQw1zHCiG+4zDOx0FcQPNj/h+BTZs27dZqtbYg4jO5mBBRGwA+OTMz876JiYn7ueOM3OTk5J7T09NrEfGtNuMA4A9xHO/rEkz0TxBLpL34XxDQWp8PABdwMSGiPwZB8OowDH/IHTOfnFLqTQDwGUYO1+PDiWitlNLYa3V5gljB5YVnEbjkkkt2f+SRR8x2KjdKvmVmZubo8fHx32WBYrPZXBUEwbcBYISjj4i2LVmyZM81a9Y8yJGflfEEsUHLyz6OgNZ6DAAiJiTTQRCsHBsb+xVTniWmlHoVAHwbEQPOACJ6t5RyE0fWE8QGJS87BwGl1E8R8UAONER0jpTS7HRlfiml3oOIG5mKfy6EYNnsCcJE1IvNRWD9+vV7DQwM/JaJzQ+FEObsR1cuIsIoin4KAC/gTICIe4VhuIUja2T8KxYXKS/3OAJKqdWI+EEOJDMzMweNj4/fypF1lVFKHYqIrA9/29csTxBXr1R4nNbapJWfwIDgu0II853Q9UtrbUi4Mm0iIvqylJKdZewJkoao/30OAlprc4rvOWnQENGolPLiNLksfrfYct4ihNiLO6cnCBcpL7cDAZN3VavVtnPgIKK/lVLezpHtVKbZbD4/CAKTspJ6DQ4O1tasWdNKFfTfIByIvMzOCCil9kfE1O1aEzGXUprqJD25rrrqqoG77rrLEHcgbcIgCJaPjY39V5qc+d0/QRKUGo1GUKvVTiIik3T3YlNYgIh+BAB1KeW/c8CsgozFB/FvhRB79xITpdQdiJg6ZxAEh46Njd3Msc0TBACSqPCN8+3rE1EcBMFbwzD8HAfQfpeJougoIvoeY53fF0KsYshlJqKUMin3R6QpJKKjpZScNfgniAFTa/0FAHjDQsCaNIUgCJ5ns3+e5qSy/p6keNyQZj8R/UBKabJwe3YppX6NiPulTRjH8Uvq9foP0uT8KxYANJvNY5OcnjS8rhdCvCJNqN9/V0rth4i/TlunOdshpXxGmlyWvyulHkbEJ6XpNG8KYRiyPugr/Yo1OTk5PD09/RtEfHYaqOZ3IjpNSnkZR7ZfZZKiDOY4a+q1dOnSpatXr2bteKUqSxFoNpt7BEHwEEfPyMjIk7ilTCtNEKVUExElB9SEIA8MDQ3tPTo6ynIEV2/Z5LTWfwSAZQy7Xy2EMBm3Xb+01ib4d1XaRER0v5TyaWlys79XliBRFB1ARCaHJ3VbcBcwPyOEOJ0LcD/Kaa3/DQCOTlsbEX1KSvnPaXJZ/K61/jQAnJamy2wwSClTba80QZIEt1sA4KA0QOf7HRFfEYahKW9TyUsp1UDE9zMW/+Aee+zxjLPOOmuaIess0mg0arVa7W4AeDJDyXuFEBcy5HaIVPIJorU2sY5O0q+3LF26dP9evV9zndkruSiKXkxEN3HmIyITR1IcWVcZrfVaAJjgjLfZwaokQZJiyiag1GmF8Q9IKRscp/SbTPIE/h8ASN2lIqKp5Lvt3m7gsH79+r0HBgZ+wSmMbXbWhBDPRETTToF1Ve4JopS6EhFPYaGziFBSfOCAXuUadWpv1uOVUhoRQ45e87RptVovbzQaj3HkuTKm10ir1foxJ3qe6NwghDAnIdlXpQhiEfPgArhZCJEaueUqK5McNx4yuyYiukYIcbLNv/dieCQFsq8FgKM4uJk/tKGhoeeOjo5aPckqQxDbmAcHdCNDRG+TUpodlMpdSqkvIeLrLBb+tampqVM7qXRo5lq7du3TlyxZYshxMHdu1x21yhDE5pWAC3oi91C73d57YmKCFTyz1F1ocfMUAYBfWJbfuXVgYOAkbjbtrgAopUw2w+Xc4G7yJ+b8HVQJgtjGPIjoNkTc3+LuvFwIYVvMzEJ9cUWVUuOIuM7GQiIy3yIfGxgYuGBsbMyUGk29oihaQURmU+SfUoXnClht7e48vO8J4hDz2G7IEcfxBYhoCpSxrqrGRhJ8/yPpTsvCalYoIcoNRPTNgYGBze12+76RkZHf77bbbvHDDz+8HxE9HwAOAYBjAeB5Vsr/Irx5ampqVaPRiF3G9z1BlFJnI+IlXHCIaEJKuX7dunVPGRwcvJOZUmHUVzY2smHDhufMzMyYrVbnItNc/1jKbSWig6WUZkva6eprgtjGPJJy+Qc0Gg1TP9Y0hDkDET/JRZaILpBSvo8r309yWuvXAsCVDqk73YKhhYiHcbN2FzKirwliu8tiDtuEYbh5Z7C01ubcwOEcL1Y9NhJF0UlxHF9l89HOwdVBpkVEJ0gpTc5YR1ffEsQ25mHK8Esp5/S4cNipqWxsxNyJURQdHcfx1xCx1tGd6Tg46Sz191JKc1y646svCeIQ89g6MjKyz0JnBLTWHwAAm1enM4QQl3bsnZIqaDabByLiNb1ux0ZEd8Zx/Krx8fG7soKuLwmitTZFldkpBXEcv75ery94lsD0wdi2bZvpdbeCCXxlYyOz+Jg/qXa7bfxwdo+SYi+P43i1Sw+QxXzadwRxiHlcJ6U8Lu3Gj6LoSCKyqW7yOSHEW9L09vvvSqnDENH0TN+nS2s1JYjO7dbBrL4iiEPMw3zM7SulvIfjPO6hnFldVY2N7Ipl0kbtjUT0XovEwkVdQkS3IuJ6IcSXOL5zlekrgiil3oWIH7IAIxRCXMSV37hx47LHHnvsTkR8CnNMZWMj8+Fj/sCUUi8JguCNAHCMZT91IqJfIeKNRHRlr2qV9Q1BbGMeJodo+fLlK0855ZQZ5s2+Q0xrbVIdbAo3XCiEeK/NHFWRXbdu3VOXLFlyGBEdSkSmWJ+p9/scE2FPiPB7ADAf3LcEQXBTGIaP9hqbfiLIl00nVCaAFATBIWNjYz9myj9BTGttvkWO5IytemyEg1GRZfqCILYxDwD4kBBitatjksQ5s6u1G1NHpWMjTIwKKVZ6gmQd8+B6yaLc/qzKM4UQ7LQVrh1errsIlJ4gSqkNiLiGCxMinhyGoUvj+ydMYXZmhoeHzVmI1FKXycDKx0a4PiqSXKkJ0q2YB9dBURQdbmrQcuWJ6PNSyjdz5b1c/giUliDdjnlwXaO1/lcAYBdH87ERLrLFkCstQWwaSSZQv0cIwWo8aeOaqsRGlFKvRMR3J2c+Ho3j+MP1ev1bNliVUbaUBHGIefwkDMMXZVVRY1dHR1FkosSft7gB1gkhzrOQz03UHIZqt9ufQsQ5zTiJ6OvLli17XbcrJ+a2+B4lkWW+Pq31VwDgJKbiGURcGYahOfHWtasfYyNKqWchoqmguFjDziuFEKd2DdicFZfuCWIb8yCiSSnlud3Gud9iI+bI8cDAwA8QcV8GdlYpOwx9hREpFUFsYx5EdM+SJUv25XY07dQrWus6AKzn6onj+O31et185BfqUkqZJjQ3zNeSbj5DTZs6k1vFbWtWqMWmGFMqgiilNiLie7gAx3F8XL1ev44r36lc0mnVtFQ4gKmrcLERU7FweHj4e5xefzuvkYj+FMfxQePj479jrr0UYqUhiG3MAwCuFkLYVP3LxGEXXXTRwXEcmw6qXGy/KIQw2a25X0lauqlYaDJtrS8i+o1JPMz60JK1IRkO4DoxwyntVdnGPIjoEUTcRwix1X62zkdorU1rhTnn2xfSXITYSNIG25yq5CZ8zrsc06Cm1Wod41qHqnP0s9VQCoJorc3++8XcpRPROVLKTvp/cKeaV860lX700Ufv4LQHSBTkfm7E9jBYCkBaCMFubdcR2F0eXHiCKKVMg01TCpTbz6OrMQ+uP7g982b1EdF6KSWrCQzXBq6c1tr8+Zg/oSyvU4UQpk5Wqa8yEOTbiGhKT3KunsQ8OIYYGaUU2/a8zo1orU21FlO1Jetr+8zMzOHj4+O3Zq24l/oKTRCl1ImIyM68JSIlpTRbrYW4zNMPEX8DAMNMg3p6bkQp9Q5E/CjTNmsxIrp3ZmbmwImJifutBxdkQGEJYvse3+uYB9d/SqlzEZF97h0R3xGG4ce5+l3ltNZvAACTHsO+B0y8AxFbADDCnZeIfrRs2bJVZU1HYYPDBSQrOdv34l7HPLjrLGJspIM6uqfHcXxfEARmK5h97xDRZVLK1BbNXEx7KcdeZC+Nso0lENEVUkrzj1jIq0jr0VofQ0TXOtTPfTwb2jZjIHFKV7Kpu+3wwhGkiP+4WThBKfVBRGSfg+/GE7HZbB6BiCZKvtRyTXMqs2itrwCA13P1lDUdpXAE0VqPAsAkF/ii5jPtan/e31RJvVyTX2XyrNjXQkW9TTnWVqu1GRFfyFVWxnSUQhGk6Ls+3BthIbm8duU2bNiwb7vdNpm53IJ3s0v4YhiGb1roHM3GjRuf+dhjj/0MEZ/Kxcako+y+++4HL1QonKunV3JFI0jh4wadOkZrfQ0AnMDU03FcJznwdBMiPos556zYN5YvX35iWmE9pdShpsgbACzh6ieibwkhXtOtA2xcOzhyhSGIUsr00L6aY7SRIaK1UsrzufJFkevlacgoip5GRObAE7cq/SxM109NTR3baDRMs83USyn1VkT8TKrgEwVKcaqyEASxfT8vez9A29wy00JACGEV0EvOyt+IiH9nc+OaKi2tVutVjUZjymac7bZ88id3kpTSPFELexWCIFrrTQDwL1yUipD9yrV1PrluZyc3Go1arVa7PukQyzaViH5mutVKKf/MHpQImmzg4eHh7yDiKy3Gmj6Ch3b7OLSFPXNEcyeIQ4zgs1JKl17ZneCU+Vjb8y1EdJWUMnVbtdFoDNVqNXNIjFU7eHZh5uN5ZmbmiImJiQdcF9tsNvdAxJ8g4l4WOu5ut9sHFzUdJVeC9GvMg3tz2FaFTIuNJHiaV5bjuTYkcncT0WGdtEuenS/p6XiLRfa1+Z4sbDpKrgSxzVMCgNOFELYfg5b3Su/Eszxjn7y2mdwq24yCPyRZt5kdlW02m6/ul3SU3AjiEPO4Xgjxit7dvr2ZyaFKSySlFLtap5T6qEl0tLT6oTiOV9Xr9V9ajksVV0qNI+K6VMEnCrxLCHGJ5ZiuiudJEHbMAwC2I+L+YRhu6SoaOSm37Oc+JzaitTaVVKzS/IloamBg4MixsTFzfr4rl206CgDMxHF8ZL1eN3GVQly5ECTJJjUNb1gXIjbCMOzGoR7W/N0W6iQ2opSSiNi0sdF0cAqC4NgwDM1OV9cul3QUAHhwYGBg5bnnnnt31wyzUNxzgtjGPIjo9lardUCj0WhbrKt0okqpsxGR/Xphzt0DgDmfYRUfMf/SAHCiEOIbvQDJJR3FtMcbHBw8tFf1zBbDoecE0Vp/GACMc1mXqc8UhuFmlnCJhWxjIwBg+vXVbM5lmAQEAHiTEOKLvYTKMR3lGiklt7xs15bTU4LYxjwA4FIhxBldW33BFNvGRmzNJ6J3Sik/ZjsuC3mXdBQi+oCUspHF/K46ekYQ25gHET0wNDS09+jo6EOuiyvjOKVUExEzL5lDRBNSSnZZ1G5gV8Z0lJ4RRGs9BgARF3gierOU0qalAFd1oeVMbKTdbpttV9sEw8XW9UEhBLtka7cAMn+SW7Zsua5M6Sg9IYiPedjdclEUHUlEptV0x9dCB546VuyowDUdZXBwcOWaNWsedJzWeVivCOJjHpYu0lp/wSEqvussix54sjQpM3HHdJQbV6xYcWTa+ZTMjEwUdZ0gthUGAeA8IYRtBDZrXHLXZ/pzDA4O3gkAyxyNYR14ctTd8TDHdJSPSCnZO6AdG2m5RWg9n495WEP2hAHNZvPMIAg+4aDF6sCTg/5MhrikoxDRaVLKyzIxgKGkq08QpdQliHg2w44dIlWJeXDxMHJaa9Nm+nCLMTdPTU0daXvgyUJ/pqIO6SjTcRwf1at0lK4RxCHm8XEhhG2yXabOKqKy5H39F9w6VkT0FSllRy0MeolD0dNRukIQ25gHAGwdGRnZpyyVLnp5A5m5lFIXIiK7K27auZFe2582X5HTUbpCEK21ScdWacDM/h7H8evr9bpp3uKveRAw/7Lbtm27jRsbKWqd4sWcW9R0lMwJYhvzIKLrpJTHeWYsjoBtbKRX3X2z9JtjOsr5Usq1Wdqxs65uEMQm5tEion2llPd0a4H9pFcpdTkivoW5po5rajHnyVTMtkSrScCM4/g19Xr9W5kakijLlCDNZvOUIAjYXYWISEgp2ekn3QCgTDodYiOF6LZlg7FLOorpSQkAL5JS3m4zF0c2M4LYxjxMzv/y5ctX9joyygGlyDJKqdMR8VILG1cLIT5kIZ+7qEs6ChH9jogOyrrDbmYEsTwTTUEQHDI2Nvbj3L1RQgNsYiN5d/x1hdcxHeV7K1asODbLP91MCGIb8yCiD0sp2YXiXEHu13Hm5kFEU+RtN84ayxYbmV2TYzrKJillZg1JOyaIj3lwbtHsZaIoej8RsQ8TlS02MouY1tp0/rXapcoyHaVjgtgWDSCi10opv5L9LVMtjY1GY3B4eNhE2PfjrLyMsZHZdSmlvoqIJ3LWmchME9EqKeWPLMbMK9oRQaIoWkFE5nAPq4urj3l06q4njo+i6HBTbJqrtYyxEbO2pMDe9y2b9dw/NDR04Ojo6L1cfOaT64ggWmtzqIdbA9bHPDrx1AJjtdafAoC3MVWXMjZi1uaSjkJEtw4PDx++evXq7Ux85og5E6TZbJ4aBAG7OgYRjUopL3Y11I+bH4GkzcGdFt2jShcb2elVy7pZDwBcKYQ41fX+cSJIlZziCmwvx0VR9GYi+qzFnKWLjexEEutmPURUl1KycwN3xtGJIFprUzrmLKZDSvtYZ66vEGI2r7tljY3MAm3bT8Z02CWi413SUawJYvthaF4fhRBrCnEX9bERyYaJyfjt69iIcWGSjnI9Iq7iutQ1HcWKIFXaWuQCXyQ525hBWWMjyc7Wk6enp2+2adbjko5iRRDbM8RldkCRbnyuLVX7A3NNR2m1Wsc0Go2YgyubILaPcAC4WgjxOo4RXiY7BGxfgcsaG5lFzCUdBQA2CCFMIcPUi02QKn0EpqJWcAGt9ccB4O1MM0u/iaKUOg8RL2Sud1bsVCFE6tEMFkGiKHojEdmUAS1cpyBL8EotXsVteId0lO1J67lbF3N2KkGqCHap2ZEYr7U2HXGvsFhLaWMjyUf78PT0tG06yr1DQ0MHL5aOkkoQpdQnEPFMJtClf1wz11kKMaUU+/hz2WMjxiHdSEdZlCC2H3ymzpkQIvPS/aW4GwtopEMBjVLV1JoPcpfqKIuloyxIkKptGRbw/s7EJIcSTMfV6/XrMpk8JyUu1VEAYI0QYuOuJi9IENudAR/zyOluSJnW9kBbmc+N7AyFQzrKtna7vfy88867b2c98xLENuZBRFdIKW0b2BfzjupDqxyORE9KKc8tMxSO6ShzetDPSxCbmAcAPNRut/eemJh4oMyA9rvtls1T+2KzZXJy0jYd5atCiJMXfYI0m81VQRDcYHHDnCWEcCnRbzGFF+0UAYeyTN8QQvxDp/PmPd4mHWW+E69zniBa608DwGnMhW0WQhzBlPViOSOgtTZV37/MMcOkiCPinkKIrRz5Istw01GIaExKuWHRJwh375yI2gBwQDeq2RUZ7LLbxvWvWSciHhiG4c/LvmZjP2PTaWu73X7BxMTE/WkEuRoRn/AeNh9ARLRWSnl+P4BXpTVYxkb2FULc0S/4JNnopoTQrm9ODyHiy+f7M5jvFcvsRpkGkotdW5YuXbp/J4fh+wX0Mq5Daz1qioWk2P5TIcQLy7i+xWw2gUQAOBkRDwGAAVMCd3Bw8H0LddCdQxATIKzVaj8EgIMWmMjscLw0DMPN/QZeVdaTbIFei4jHLuTjOI5PqNfr11YFk4XWOe82b6PRqNVqNZMKfPwuA39FRGdIKW+qOnBlX38URSNEZAjw8l3WstW0WAjD8LtlX2MW9i+ai9VsNl8WBMHLiGgQALa0Wq3Pck9iZWGc19F9BEy+HQAcE8cxEtGv99prry9lWfy5+yvo7gyp2bzdnd5r9wgUGwFPkGL7x1uXMwKeIDk7wE9fbAQ8QYrtH29dzgh4guTsAD99sRHwBCm2f7x1OSPgCZKzA/z0xUbAE6TY/vHW5YyAJ0jODvDTFxsBT5Bi+8dblzMCniA5O8BPX2wEPEGK7R9vXc4IeILk7AA/fbER8AQptn+8dTkj4AmSswP89MVGwBOk2P7x1uWMgCdIzg7w0xcbAU+QYvvHW5czAp4gOTvAT19sBDxBiu0fb13OCHiC5OwAP32xEfAEKbZ/vHU5I+AJkrMD/PTFRsATpNj+8dbljIAnSM4O8NMXGwFPkGL7x1uXMwKeIDk7wE9fbAQ8QYrtH29dzgh4guTsAD99sRHwBCm2f7x1OSPgCZKzA/z0xUbAE6TY/vHW5YyAJ0jODvDTFxsBT5Bi+8dblzMCniA5O8BPX2wE/g/+kH59O8yayQAAAABJRU5ErkJggg==',
    //判断是否是微信
    is_weixin: function () {
        var e = navigator.userAgent.toLowerCase();
        return "micromessenger" == e.match(/MicroMessenger/i);
    },
    //判断是否是阿里
    is_alipay: function () {
        var e = navigator.userAgent.toLowerCase();
        return "alipayclient" == e.match(/AlipayClient/i);
    },
    //截取当前地址栏的指定参数的值
    spliceRouter(name) {
        var index = window.location.href.lastIndexOf("?");
        var seachURL = window.location.href.substring(index + 1);
        var str = seachURL.split("&");
        for (var i = 0; i < str.length; i++) {
            var str1 = str[i].split("=");
            if (str1[0] == name) {
                return decodeURIComponent(str1[1]);
            }
        }
    },
    //关闭微信浏览器
    closeWx() {
        function e() {
            WeixinJSBridge.invoke("closeWindow", {},
                function (e) {
                })
        }
        "undefined" == typeof WeixinJSBridge ? document.addEventListener ? document.addEventListener("WeixinJSBridgeReady", e, !1) : document.attachEvent && (document.attachEvent("WeixinJSBridgeReady", e), document.attachEvent("onWeixinJSBridgeReady", e)) : e()
    },
    //关闭支付宝浏览器
    closeAli() {
        AlipayJSBridge.call("closeWebview");
    },
    //时区转换
    toTimeZone(date, offset, offset1) {
        var currTz = moment.tz(date, offset);
        return currTz.clone().tz(offset1).format("YYYY-MM-DD HH:mm:ss");
    },
    //保留小数点
    round: function (old, len) {
        var a1 = Math.pow(10, len) * (old * 1000);
        a1 = a1 / 1000;
        a1 = Math.round(a1);
        var oldstr = old.toString();
        var start = oldstr.indexOf(".");
        if (start > 0 && oldstr.split(".")[1].length == len + 1) {
            if (oldstr.substr(len + 1, 1) == 5) {
                var flagval = oldstr.substr(len, 1) - 0;
                if (flagval % 2 == 0) {
                    a1 = a1 - 1;
                }
            }
        }
        var b1 = a1 / Math.pow(10, len);
        return b1;
    },
    clearNoNum(value) {
        isNaN(value) || value == "" ? (value = "0") : "";
        value = value.replace(/[^\d.]/g, "");
        value = value.replace(/\.{2,}/g, ".");
        value = value.replace(/^\./g, "");
        value = value
            .replace(".", "$#$")
            .replace(/\./g, "")
            .replace("$#$", ".");
        value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3");
        return value;
    }
}
