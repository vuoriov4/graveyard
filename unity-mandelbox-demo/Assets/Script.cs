using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Script : MonoBehaviour
{
    float cameraX = 0.0f;
    float cameraY = 0.0f;
    float cameraZ = -3.5f;
    float scale = 0.01f;
    float zx = 0.0f;
    float zy = 0.0f;
    float zz = 0.0f;
    // Update is called once per frame
    void Update()
    {
        if (Input.GetKey(KeyCode.W)) cameraZ += scale * 0.1f;
        if (Input.GetKey(KeyCode.A)) cameraX -= scale * 0.1f;
        if (Input.GetKey(KeyCode.S)) cameraZ -= scale * 0.1f;
        if (Input.GetKey(KeyCode.D)) cameraX += scale * 0.1f;
        if (Input.GetKey(KeyCode.Q)) cameraY += scale * 0.1f;
        if (Input.GetKey(KeyCode.E)) cameraY -= scale * 0.1f;
        if (Input.GetKey(KeyCode.UpArrow)) scale *= 0.95f;
        if (Input.GetKey(KeyCode.DownArrow)) scale *= 1.05f;
        if (Input.GetKey(KeyCode.Alpha1)) zx += 0.01f;
        if (Input.GetKey(KeyCode.Alpha2)) zx -= 0.01f;
        if (Input.GetKey(KeyCode.Alpha3)) zy += 0.01f;
        if (Input.GetKey(KeyCode.Alpha4)) zy -= 0.01f;
        if (Input.GetKey(KeyCode.Alpha5)) zz += 0.01f;
        if (Input.GetKey(KeyCode.Alpha6)) zz -= 0.01f;
        Shader.SetGlobalFloat("cameraX", cameraX);
        Shader.SetGlobalFloat("cameraY", cameraY);
        Shader.SetGlobalFloat("cameraZ", cameraZ);
        Shader.SetGlobalFloat("scale", scale);
        Shader.SetGlobalFloat("zx", zx);
        Shader.SetGlobalFloat("zy", zy);
        Shader.SetGlobalFloat("zz", zz);
    }
}
