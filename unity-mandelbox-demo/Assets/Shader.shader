Shader "Unlit/TestShader2" {
    Properties {
        _MainTex ("Texture", 2D) = "white" {}
    }
    SubShader {
        Tags { "RenderType"="Opaque" }
        LOD 100
        Pass {
            CGPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #pragma multi_compile_fog // make fog work
            #include "UnityCG.cginc"
            struct appdata {
                float4 vertex : POSITION;
                float2 uv : TEXCOORD0;
            };
            struct v2f {
                float2 uv : TEXCOORD0;
                UNITY_FOG_COORDS(1)
                float4 vertex : SV_POSITION;
            };
            sampler2D _MainTex;
            float4 _MainTex_ST;
            v2f vert (appdata v) {
                v2f o;
                o.vertex = UnityObjectToClipPos(v.vertex);
                o.uv = TRANSFORM_TEX(v.uv, _MainTex);
                UNITY_TRANSFER_FOG(o,o.vertex);
                return o;
            }
            /*
                Relevant stuff right here
            */
            #define PI 3.14159265359
            #define RM_EPSILON 0.00005
            #define GRD_EPSILON 0.0001
            #define SDW_EPSILON 0.002
            #define RFL_EPSILON 0.01
            #define RM_MAX_ITERATIONS 1000
            #define REC_MAX_ITERATIONS 10
            float cameraX; // Shader.SetGlobalFloat
            float cameraY; // Shader.SetGlobalFloat
            float cameraZ; // Shader.SetGlobalFloat
            float scale; // Shader.SetGlobalFloat
            float zx; // Shader.SetGlobalFloat
            float zy; // Shader.SetGlobalFloat
            float zz; // Shader.SetGlobalFloat
            struct RayMarchResult {
                int iterations;
                float distance;
                float3 position;
                float3 direction;
                float3 normal;
                float shadow;
                float hit;
                float3 orbitMinima;
            };
            struct DistanceResult {
                float distance;
                float3 orbitMinima;
            };
            float DistanceFloor(float3 pos) {
                return pos.y + 5.0;
            }
            float DistanceSphere(float3 pos) {
                float3 origin = { 0, 0, 0 };
                float radius = 0.001;
                return length(origin - pos + 0.0*cos(pos.x*5.0 + _Time.y*5.0)) - radius;
            }
            DistanceResult DistanceRecursive(float3 pos) {
                DistanceResult dres;
                float3 z = { pos.x, pos.y, pos.z };
                float3 minz = { pos.x, pos.y, pos.z };
                float3 offset ={zx, zy, zz};
                float dr = 1.0;
                float foldingLimit = 1.00;
                float fixedRadius2 = 1.00;//2.0*abs(cos(_Time.y));
                float minRadius2 = 0.125;//*abs(sin(2.0*_Time.y));
                float Scale = 3.0;
                for (int n = 0; n < REC_MAX_ITERATIONS; n++) {
                    // Box fold
                    z = clamp(z, -foldingLimit, foldingLimit) * 2.0 - z;
                    // Sphere fold 
                    float r2 = dot(z,z);
                    if (r2<minRadius2) { 
                        // linear inner scaling
                        float temp = (fixedRadius2/minRadius2);
                        z *= temp;
                        dr *= temp;
                    } else if (r2<fixedRadius2) { 
                        // this is the actual sphere inversion
                        float temp =(fixedRadius2/r2);
                        z *= temp;
                        dr *= temp;
                    }
                    z = Scale*z + offset;   // Scale & Translate
                    minz = min(z, minz);
                    dr = dr*abs(Scale)+1.0;
                }
                float r = length(z);
                dres.distance = r/abs(dr);
                dres.orbitMinima = minz;
                return dres;
            }
            DistanceResult DistanceGlobal(float3 pos) {
                return DistanceRecursive(pos);
            }
            float3 Gradient(float3 pos) {
                float3 dx = { GRD_EPSILON, 0, 0 };
                float3 dy = { 0, GRD_EPSILON, 0 };
                float3 dz = { 0, 0, GRD_EPSILON };
                float dfdx = (DistanceGlobal(pos + dx).distance - DistanceGlobal(pos - dx).distance);
                float dfdy = (DistanceGlobal(pos + dy).distance - DistanceGlobal(pos - dy).distance);
                float dfdz = (DistanceGlobal(pos + dz).distance - DistanceGlobal(pos - dz).distance);
                float3 result = { dfdx, dfdy, dfdz };
                result /= 2 * GRD_EPSILON;
                return result;
            }
            RayMarchResult RayMarch(float3 rayPosition, float3 rayDirection) {
                float distance;
                float3 position = { rayPosition.x, rayPosition.y, rayPosition.z };
                int iterations = 0;
                float shadow = 1;
                float ss = 10;
                DistanceResult dres;
                for (iterations = 1; iterations < RM_MAX_ITERATIONS; iterations++) {
                    dres = DistanceGlobal(position);
                    if (dres.distance < RM_EPSILON) {
                        // hit
                        shadow = 0.0;
                        break;
                    }
                    shadow = min(shadow, ss * dres.distance / distance);
                    distance += dres.distance;
                    position = position + rayDirection * dres.distance;
                }
                RayMarchResult rmr;
                rmr.hit = iterations < RM_MAX_ITERATIONS ? 1.0 : 0.0;
                rmr.iterations = iterations;
                rmr.orbitMinima = dres.orbitMinima;
                rmr.shadow = shadow;
                rmr.distance = distance;
                rmr.position = position;
                rmr.direction = rayDirection;
                rmr.normal = normalize(Gradient(rmr.position));
                return rmr;
            }
            float4 shade(RayMarchResult rmr) {
                float4 color = { 0, 0, 0, 1 };
                float4 sky = {1, 1, 1, 1};
                if (rmr.iterations == RM_MAX_ITERATIONS) return sky;
                float3 lightDirection = { 0, -1, 1 };
                lightDirection = normalize(lightDirection);
                float occlusion = 2.0*pow(rmr.iterations,-0.5);
                float3 red = {0.8, 0.2, 0.2};
                float3 blue = {0.2, 0.2, 0.8};
                float3 green = {0.2, 0.8, 0.2};
                float3 white = {1.0, 1.0, 1.0};
                float3 nom = rmr.orbitMinima;
                float3 diffuseColor = 
                    green * (0.5 + 0.5*cos(length(nom)*0.01 + PI/2));
                float3 specularColor = white;
                float fog = (1 - 1/(pow(100,rmr.distance)));
                float3 H = -1.0 * normalize(lightDirection + rmr.direction);
                //RayMarchResult sdwRmr = RayMarch(rmr.position + rmr.normal * SDW_EPSILON, -lightDirection);
                //RayMarchResult rflRmr = RayMarch(rmr.position + rmr.normal * RFL_EPSILON, reflect(rmr.direction, rmr.normal));
                //float3 rflDiffuse = rflRmr.hit * diffuseColor * max(0, dot(-lightDirection, rflRmr.normal));
                color.xyz = white * fog + (1 - fog) * occlusion * (
                    0.25 * specularColor * pow(abs(dot(rmr.normal, H)), 2.0) 
                    + 0.75 * diffuseColor  *  abs(dot(-lightDirection, rmr.normal))
                );
                return color;
            }
            fixed4 frag (v2f i) : SV_Target {
                fixed4 col = tex2D(_MainTex, i.uv); // sample the texture
                UNITY_APPLY_FOG(i.fogCoord, col); // apply fog
                float screenSize = scale; // 1.0*abs(cos(_Time.x * 5.0));
                float fov =  PI / 3.0;
                float Z = (screenSize * 0.5) / tan(fov * 0.5);
                float3 cameraPosition = { cameraX, cameraY, cameraZ };
                float3 rayPosition = { 
                    screenSize * (i.uv.x - 0.5) + cameraPosition.x, 
                    screenSize * (i.uv.y - 0.5) + cameraPosition.y, 
                    0 + cameraPosition.z 
                };
                float3 rayOrigin = { cameraPosition.x, cameraPosition.y, cameraPosition.z - Z };
                float3 rayDirection = normalize(rayPosition - rayOrigin);
                RayMarchResult rmr = RayMarch(rayPosition, rayDirection);
                return shade(rmr);
            }
            ENDCG
        }
    }
}
