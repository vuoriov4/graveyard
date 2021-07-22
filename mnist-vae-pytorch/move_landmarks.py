import shutil
import os
root_dir = "data/cats"
annotation_dir = "data/annotations" 
for i in range(0, 7): 
    folder_path = "/CAT_0" + str(i)
    for f in os.listdir(root_dir + folder_path):
        if (f[-3:] == "cat"):
            p1 = os.path.join(root_dir + folder_path, f)
            p2 = os.path.join(annotation_dir + folder_path, f)
            shutil.move(p1, p2)
