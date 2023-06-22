# ラジオストリーミングの保存 （node.js 版）

## らじる★らじる（NHK on Demand）

```bash
node rec-nhk-on-demand.js {r1|r2|r3} duration filename
```

- r1: NHKラジオ第1
- r2: NHKラジオ第2
- r3: NHKFM

## radiko

```bash
node rec-radiko.js {TBS|QRR|LFR|INT|FMT|FMJ|JORF|BAYFM78|NACK5|YFM|...} duration filename
```

タイムフリー

```bash
node rec-radiko-time-free.js {TBS|QRR|LFR|INT|FMT|FMJ|JORF|BAYFM78|NACK5|YFM|...} start end filename
```

放送局IDは <http://radiko.jp/v3/station/region/full.xml> を参照のこと。
