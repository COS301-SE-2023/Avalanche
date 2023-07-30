from transformers import pipeline # type: ignore
import sys
import json
import numpy as np

def categorize(strings,Inputlabels,confidenceMin):
    data = []
    batch_size = 30
    all=strings.split(",")
    classifier = pipeline(task = 'zero-shot-classification', model='./Models/distilbart', tokenizer='./Models/distilbart',device=0)
    
    #classifier = pipeline("zero-shot-classification",model="valhalla/distilbart-mnli-12-3")
    #classifier.save_pretrained("./Models/distilbart")
    labels=Inputlabels.split(",")
    for i in range (0,len(all),batch_size):
        instance=(classifier(all[i:i+batch_size],candidate_labels=labels,))
        print(instance)
        
        for i in range(0,len(instance)):
            midRes={}            
            midRes['domain']=instance[i]['sequence']
            labels=np.array(instance[i]['labels'])
            scores=instance[i]['scores']
            scores=np.array([float(x) for x in scores])
            midRes['labels']=(labels[scores>confidenceMin]).tolist() #Note to future self: This could be optimized by taking advantage of the fact that the array is sorted. It may be more efficient to find the smallest index below the minimumConfidence and then take everything before that.
            midRes['scores']=(scores[scores>confidenceMin]).tolist() 
            data.append(midRes)
            #classifier.save_pretrained('./Models/distilbart/') 
    
    print(json.dumps(data))

if __name__ == "__main__":
    s = (sys.argv[1])
    labels=(sys.argv[2])
    min = float(sys.argv[3])
    categorize(s,labels,min)