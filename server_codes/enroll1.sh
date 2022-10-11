#!/bin/bash
#$ -cwd 
#$ -j y 
#$ -S /bin/bash

# Copyright 2015   David Snyder
#           2015   Johns Hopkins University (Author: Daniel Garcia-Romero)
#           2015   Johns Hopkins University (Author: Daniel Povey)
# Apache 2.0.
#
# See README.txt for more info on data required.
# Results (EERs) are inline in comments below.
#
# This example script shows how to replace the GMM-UBM
# with a DNN trained for ASR. It also demonstrates the 
# using the DNN to create a supervised-GMM.

train_cmd=run.pl
. path.sh
set -e

if [ -d "./data" ];then
	rm -rf ./data
fi

if [ -d "./xvector_results" ];then
	rm -rf ./xvector_results
fi

wavdir=$1

datadir=`pwd`/data
logdir=`pwd`/data/log
featdir=`pwd`/data/feat
nnet_dir=`pwd`/exp/xvector_nnet_1a

. parse_options.sh || exit 1;


echo ==================================================
echo "Data Preparation: get utt2spk and sort spk2utt"
echo ==================================================
  python make_data.py $wavdir $datadir
	utils/utt2spk_to_spk2utt.pl $datadir/utt2spk > $datadir/spk2utt || exit 1
	utils/spk2utt_to_utt2spk.pl $datadir/spk2utt > $datadir/utt2spk || exit 1

  utils/fix_data_dir.sh $datadir
echo ==== Data Preparation successful `date` ====


echo ======================
echo "Feature Extraction"
echo ======================
  # Extract speaker features MFCC.
  steps/make_mfcc.sh --write-utt2num-frames true --mfcc-config conf/mfcc.conf --nj 1 --cmd "$train_cmd" \
    $datadir $logdir/make_enrollmfcc $featdir/mfcc

  utils/fix_data_dir.sh $datadir
echo ==== Feature Extraction successful `date` ====


echo ===================================
echo "Generate VAD file in data/train"
echo ===================================
  # Compute VAD decisions. These will be shared across both sets of features.
  sid/compute_vad_decision.sh --nj 1 --cmd "$train_cmd" \
    $datadir $logdir/make_enrollvad $featdir/vad

  utils/fix_data_dir.sh $datadir
echo ==== VAD generation successful `date` ====


echo =====================
echo "Extract X-vectors"
echo =====================
# Extract the xVectors
  sid/nnet3/xvector/extract_xvectors.sh --cmd "$train_cmd" --nj 1 \
    $nnet_dir $datadir ./xvector_results

  # $KALDI_ROOT/src/bin/copy-vector ark:xvector_results/xvector.1.ark ark,t:- >xvector_results/xvector.txt

echo ==== Extraction successful `date` ====
echo ==== Please remember to modify trials OR upload a new trials file for PLDA scoring ====

