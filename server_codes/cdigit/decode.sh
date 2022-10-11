#!/bin/bash
./compute-mfcc-feats \
   --subtract-mean=true\
    --config=conf/mfcc.conf \
    scp:transcriptions/wav.scp \
    ark,scp:transcriptions/feats.ark,transcriptions/feats.scp

./add-deltas \
    scp:transcriptions/feats.scp \
    ark:transcriptions/delta-feats.ark

./gmm-latgen-faster \
    --word-symbol-table=exp/tri1/graph/words.txt \
    exp/tri1/final.mdl \
    exp/tri1/graph/HCLG.fst \
    ark:transcriptions/delta-feats.ark \
    ark,t:transcriptions/lattices.ark

./lattice-best-path \
    --word-symbol-table=exp/tri1/graph/words.txt \
    ark:transcriptions/lattices.ark \
    ark,t:transcriptions/one-best.tra

utils/int2sym.pl -f 2- \
    exp/tri1/graph/words.txt \
    transcriptions/one-best.tra \
    > transcriptions/one-best-hypothesis.txt
